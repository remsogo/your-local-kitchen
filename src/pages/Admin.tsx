import { useEffect, useRef, useState } from "react";
import { MenuItem } from "@/data/menuData";
import { Lock, Save, Trash2, Edit2, Image, Upload, X, LogOut, Plus, Minus, FolderPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMenu } from "@/hooks/useMenu";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Admin = () => {
  const { authenticated, isAdmin, loading: authLoading, email, setEmail, password, setPassword, loginError, handleLogin, handleLogout } = useAdminAuth();
  const { menu, loading: menuLoading, refetch } = useMenu();
  const [editingItem, setEditingItem] = useState<{ catId: string; itemIdx: number } | null>(null);
  const [editForm, setEditForm] = useState<MenuItem>({ name: "", description: "", prices: [] });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingItem, setCreatingItem] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategorySubtitle, setNewCategorySubtitle] = useState("");
  const [newItemCategoryId, setNewItemCategoryId] = useState("");
  const [newItemForm, setNewItemForm] = useState<MenuItem>({
    name: "",
    description: "",
    imageUrl: "",
    prices: [{ label: "", price: "" }],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!newItemCategoryId && menu.length > 0) {
      setNewItemCategoryId(menu[0].id);
    }
  }, [menu, newItemCategoryId]);

  const startEdit = (catId: string, itemIdx: number) => {
    const cat = menu.find((c) => c.id === catId)!;
    setEditingItem({ catId, itemIdx });
    setEditForm({ ...cat.items[itemIdx] });
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      const item = menu.find(c => c.id === editingItem.catId)!.items[editingItem.itemIdx];
      const dbId = item.dbId;
      if (!dbId) return;

      // Update item
      await supabase
        .from("menu_items")
        .update({ name: editForm.name, description: editForm.description, image_url: editForm.imageUrl || null })
        .eq("id", dbId);

      // Delete old prices and insert new ones
      await supabase.from("menu_item_prices").delete().eq("item_id", dbId);
      if (editForm.prices.length > 0) {
        await supabase.from("menu_item_prices").insert(
          editForm.prices.map((p, i) => ({ item_id: dbId, label: p.label, price: p.price, sort_order: i }))
        );
      }

      await refetch();
      setEditingItem(null);
    } catch (err) {
      console.error("Error saving:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (catId: string, itemIdx: number) => {
    const item = menu.find(c => c.id === catId)!.items[itemIdx];
    if (!item.dbId) return;
    await supabase.from("menu_items").delete().eq("id", item.dbId);
    await refetch();
  };

  const createCategory = async () => {
    const title = newCategoryTitle.trim();
    if (!title) return;
    setCreatingCategory(true);
    try {
      await supabase.from("menu_categories").insert({
        id: crypto.randomUUID(),
        title,
        subtitle: newCategorySubtitle.trim() || null,
        sort_order: menu.length,
      });
      setNewCategoryTitle("");
      setNewCategorySubtitle("");
      await refetch();
    } catch (err) {
      console.error("Error creating category:", err);
      alert("Impossible de creer la categorie.");
    } finally {
      setCreatingCategory(false);
    }
  };

  const createItem = async () => {
    if (!newItemCategoryId) return;
    const name = newItemForm.name.trim();
    if (!name) return;
    const cleanPrices = newItemForm.prices
      .map((p) => ({ label: p.label.trim(), price: p.price.trim() }))
      .filter((p) => p.price);
    if (cleanPrices.length === 0) return;

    setCreatingItem(true);
    try {
      const sortOrder = menu.find((c) => c.id === newItemCategoryId)?.items.length ?? 0;
      const { data: insertedItem, error: itemError } = await supabase
        .from("menu_items")
        .insert({
          category_id: newItemCategoryId,
          name,
          description: newItemForm.description.trim(),
          image_url: newItemForm.imageUrl?.trim() || null,
          sort_order: sortOrder,
        })
        .select("id")
        .single();

      if (itemError || !insertedItem?.id) throw itemError || new Error("Insert item failed");

      const { error: pricesError } = await supabase
        .from("menu_item_prices")
        .insert(cleanPrices.map((p, i) => ({ item_id: insertedItem.id, label: p.label, price: p.price, sort_order: i })));

      if (pricesError) throw pricesError;

      setNewItemForm({ name: "", description: "", imageUrl: "", prices: [{ label: "", price: "" }] });
      await refetch();
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Impossible de creer le produit.");
    } finally {
      setCreatingItem(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `menu-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(filePath, file);

      if (uploadError) {
        alert("Erreur upload : " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(filePath);

      setEditForm({ ...editForm, imageUrl: data.publicUrl });
    } catch (err) {
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const loading = authLoading || menuLoading;

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!authenticated || !isAdmin) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-card rounded-xl p-8 max-w-sm w-full card-glow">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-primary" />
            <h1 className="font-display text-3xl text-foreground">Admin</h1>
          </div>
          {loginError && (
            <p className="text-destructive text-sm mb-4">{loginError}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 mb-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-secondary text-foreground rounded-lg px-4 py-3 mb-4 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-semibold hover:opacity-90 transition-opacity"
          >
            Connexion
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-5xl text-gradient">Tableau de bord</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded-lg px-4 py-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut size={16} /> Deconnexion
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-12">
          Modifiez les prix, descriptions et photos de vos produits. Les changements sont enregistres dans la base de donnees.
        </p>

        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-card p-4 card-glow">
            <h2 className="mb-3 flex items-center gap-2 font-display text-2xl text-foreground">
              <FolderPlus size={18} className="text-primary" />
              Ajouter une categorie
            </h2>
            <div className="space-y-2">
              <input
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nom de categorie"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
              />
              <input
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Sous-titre (optionnel)"
                value={newCategorySubtitle}
                onChange={(e) => setNewCategorySubtitle(e.target.value)}
              />
              <button
                onClick={createCategory}
                disabled={creatingCategory || !newCategoryTitle.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Plus size={14} />
                {creatingCategory ? "Creation..." : "Creer la categorie"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-4 card-glow">
            <h2 className="mb-3 flex items-center gap-2 font-display text-2xl text-foreground">
              <Plus size={18} className="text-primary" />
              Ajouter un produit
            </h2>
            <div className="space-y-2">
              <select
                value={newItemCategoryId}
                onChange={(e) => setNewItemCategoryId(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {menu.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
              <input
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nom du produit"
                value={newItemForm.name}
                onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
              />
              <input
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Description"
                value={newItemForm.description}
                onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
              />
              <input
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="URL image (optionnel)"
                value={newItemForm.imageUrl || ""}
                onChange={(e) => setNewItemForm({ ...newItemForm, imageUrl: e.target.value })}
              />

              <div className="space-y-2">
                {newItemForm.prices.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="w-1/3 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Label"
                      value={p.label}
                      onChange={(e) => {
                        const prices = [...newItemForm.prices];
                        prices[i] = { ...prices[i], label: e.target.value };
                        setNewItemForm({ ...newItemForm, prices });
                      }}
                    />
                    <input
                      className="w-2/3 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Prix"
                      value={p.price}
                      onChange={(e) => {
                        const prices = [...newItemForm.prices];
                        prices[i] = { ...prices[i], price: e.target.value };
                        setNewItemForm({ ...newItemForm, prices });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newItemForm.prices.length === 1) return;
                        const prices = newItemForm.prices.filter((_, idx) => idx !== i);
                        setNewItemForm({ ...newItemForm, prices });
                      }}
                      className="rounded-lg border border-border bg-secondary px-2 text-foreground hover:bg-destructive hover:text-destructive-foreground"
                      aria-label="Retirer la ligne de prix"
                    >
                      <Minus size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewItemForm({ ...newItemForm, prices: [...newItemForm.prices, { label: "", price: "" }] })}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Plus size={12} />
                  Ajouter une ligne de prix
                </button>
              </div>

              <button
                onClick={createItem}
                disabled={creatingItem || !newItemForm.name.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Plus size={14} />
                {creatingItem ? "Creation..." : "Creer le produit"}
              </button>
            </div>
          </div>
        </div>

        {/* Editing modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card rounded-xl p-6 max-w-md w-full card-glow max-h-[90vh] overflow-y-auto">
              <h3 className="font-display text-2xl text-foreground mb-4">Modifier le produit</h3>
              <div className="space-y-3">
                <input
                  className="w-full bg-secondary text-foreground rounded-lg px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Nom"
                />
                <input
                  className="w-full bg-secondary text-foreground rounded-lg px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Description"
                />
                {editForm.prices.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="w-1/3 bg-secondary text-foreground rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      value={p.label}
                      onChange={(e) => {
                        const newPrices = [...editForm.prices];
                        newPrices[i] = { ...newPrices[i], label: e.target.value };
                        setEditForm({ ...editForm, prices: newPrices });
                      }}
                      placeholder="Label"
                    />
                    <input
                      className="w-2/3 bg-secondary text-foreground rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      value={p.price}
                      onChange={(e) => {
                        const newPrices = [...editForm.prices];
                        newPrices[i] = { ...newPrices[i], price: e.target.value };
                        setEditForm({ ...editForm, prices: newPrices });
                      }}
                      placeholder="Prix"
                    />
                  </div>
                ))}

                {/* Image section */}
                <div className="border border-border rounded-lg p-3 space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Image size={16} className="text-primary" /> Photo du produit
                  </label>
                  
                  {editForm.imageUrl && (
                    <div className="relative">
                      <img
                        src={editForm.imageUrl}
                        alt={editForm.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setEditForm({ ...editForm, imageUrl: undefined })}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground rounded-lg py-2 text-sm hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                      <Upload size={14} />
                      {uploading ? "Upload..." : "Uploader une photo"}
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />

                  <input
                    className="w-full bg-secondary text-foreground rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    value={editForm.imageUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value || undefined })}
                    placeholder="Ou collez une URL d'image..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save size={16} /> {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2 font-semibold hover:opacity-80 transition-opacity"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu categories */}
        <div className="space-y-12">
          {menu.map((category) => (
            <section key={category.id}>
              <h2 className="font-display text-3xl text-gradient mb-4">{category.title}</h2>
              <div className="space-y-2">
                {category.items.map((item, idx) => (
                  <div
                    key={item.dbId || item.name + idx}
                    className="bg-card rounded-lg p-4 flex items-center justify-between border border-border/50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <Image size={16} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{item.name}</span>
                          {item.prices.map((p) => (
                            <span key={p.label + p.price} className="bg-price text-price-foreground text-xs font-bold px-2 py-0.5 rounded">
                              {p.label ? `${p.label} ` : ""}{p.price}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <button
                        onClick={() => startEdit(category.id, idx)}
                        className="p-2 rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteItem(category.id, idx)}
                        className="p-2 rounded-lg bg-secondary text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;

