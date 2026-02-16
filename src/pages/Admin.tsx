import { useEffect, useRef, useState } from "react";
import { MenuItem } from "@/data/menuData";
import { Lock, Save, Trash2, Edit2, Image, Upload, X, LogOut, Plus, Minus, FolderPlus, ChevronUp, ChevronDown, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMenu } from "@/hooks/useMenu";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { createCategoryPayload, createItemPayload, sanitizePrices, toSupabaseErrorMessage } from "@/lib/adminMenu";
import { useSauces } from "@/hooks/useSauces";
import { useAnalyticsOverview } from "@/hooks/useAnalyticsOverview";
import { formatInteractionLabel } from "@/lib/analyticsLabels";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const { authenticated, isAdmin, loading: authLoading, email, setEmail, password, setPassword, loginError, handleLogin, handleLogout } = useAdminAuth();
  const { menu, loading: menuLoading, refetch } = useMenu();
  const { sauces, error: saucesError, refetch: refetchSauces } = useSauces();
  const [analyticsDays, setAnalyticsDays] = useState<7 | 30 | 90>(30);
  const [analyticsPage, setAnalyticsPage] = useState<string>("all");
  const { data: analytics, loading: analyticsLoading, error: analyticsError, pageOptions, refetch: refetchAnalytics } = useAnalyticsOverview({
    days: analyticsDays,
    page: analyticsPage,
  });
  const [editingItem, setEditingItem] = useState<{ catId: string; itemIdx: number } | null>(null);
  const [editForm, setEditForm] = useState<MenuItem>({ name: "", description: "", prices: [] });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingItem, setCreatingItem] = useState(false);
  const [adminTab, setAdminTab] = useState<"menu" | "sauces" | "analytics">("menu");
  const [adminMessage, setAdminMessage] = useState<string>("");
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategorySubtitle, setNewCategorySubtitle] = useState("");
  const [newItemCategoryId, setNewItemCategoryId] = useState("");
  const [newSauceName, setNewSauceName] = useState("");
  const [savingSauces, setSavingSauces] = useState(false);
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
    setAdminMessage("");
  };

  const saveEdit = async () => {
    if (!editingItem) {
      setAdminMessage("Aucun produit en cours de modification.");
      return;
    }
    setSaving(true);
    setAdminMessage("");
    try {
      const item = menu.find(c => c.id === editingItem.catId)!.items[editingItem.itemIdx];
      const dbId = item.dbId;
      if (!dbId) {
        setAdminMessage("Produit invalide: identifiant manquant.");
        return;
      }

      // Step 1: persist the main item fields.
      const { error: updateError } = await supabase
        .from("menu_items")
        .update({ name: editForm.name, description: editForm.description, image_url: editForm.imageUrl || null })
        .eq("id", dbId);
      if (updateError) throw updateError;

      // Step 2: rewrite item prices so the DB order always mirrors the form order.
      const { error: deletePricesError } = await supabase.from("menu_item_prices").delete().eq("item_id", dbId);
      if (deletePricesError) throw deletePricesError;
      if (editForm.prices.length > 0) {
        const { error: insertPricesError } = await supabase.from("menu_item_prices").insert(
          editForm.prices.map((p, i) => ({ item_id: dbId, label: p.label, price: p.price, sort_order: i }))
        );
        if (insertPricesError) throw insertPricesError;
      }

      await refetch();
      setEditingItem(null);
      setAdminMessage("Produit mis a jour.");
    } catch (err) {
      const message = toSupabaseErrorMessage(err, "Impossible de sauvegarder le produit.");
      console.error("[Admin] saveEdit failed", err);
      setAdminMessage(`Erreur sauvegarde: ${message}`);
      alert(`Impossible de sauvegarder le produit: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (catId: string, itemIdx: number) => {
    setAdminMessage("");
    try {
      const item = menu.find(c => c.id === catId)!.items[itemIdx];
      if (!item.dbId) {
        setAdminMessage("Suppression impossible: identifiant produit manquant.");
        return;
      }
      const { error } = await supabase.from("menu_items").delete().eq("id", item.dbId);
      if (error) throw error;
      await refetch();
      setAdminMessage("Produit supprime.");
    } catch (err) {
      const message = toSupabaseErrorMessage(err, "Impossible de supprimer le produit.");
      console.error("[Admin] deleteItem failed", err);
      setAdminMessage(`Erreur suppression: ${message}`);
      alert(`Impossible de supprimer le produit: ${message}`);
    }
  };

  const createCategory = async () => {
    const title = newCategoryTitle.trim();
    if (!title) {
      setAdminMessage("Le nom de categorie est requis.");
      return;
    }
    setCreatingCategory(true);
    setAdminMessage("");
    try {
      const payload = createCategoryPayload(title, newCategorySubtitle, menu.length);
      console.info("[Admin] createCategory payload", payload);
      const { error } = await supabase.from("menu_categories").insert(payload);
      if (error) throw error;
      setNewCategoryTitle("");
      setNewCategorySubtitle("");
      await refetch();
      setAdminMessage("Categorie creee.");
    } catch (err) {
      const message = toSupabaseErrorMessage(err, "Impossible de creer la categorie.");
      console.error("[Admin] createCategory failed", err);
      setAdminMessage(`Erreur categorie: ${message}`);
      alert(`Impossible de creer la categorie: ${message}`);
    } finally {
      setCreatingCategory(false);
    }
  };

  const createItem = async () => {
    if (!newItemCategoryId) {
      setAdminMessage("Choisissez une categorie.");
      return;
    }
    const name = newItemForm.name.trim();
    if (!name) {
      setAdminMessage("Le nom du produit est requis.");
      return;
    }
    const cleanPrices = sanitizePrices(newItemForm.prices);
    if (cleanPrices.length === 0) {
      setAdminMessage("Ajoutez au moins un prix valide.");
      return;
    }

    setCreatingItem(true);
    setAdminMessage("");
    try {
      const sortOrder = menu.find((c) => c.id === newItemCategoryId)?.items.length ?? 0;
      const itemPayload = createItemPayload(newItemCategoryId, newItemForm, sortOrder);
      console.info("[Admin] createItem payload", itemPayload);
      console.info("[Admin] createItem prices", cleanPrices);
      const { data: insertedItem, error: itemError } = await supabase
        .from("menu_items")
        .insert(itemPayload)
        .select("id")
        .single();

      if (itemError || !insertedItem?.id) throw itemError || new Error("Insert item failed");

      // Insert prices after item creation so every price row points to the fresh item id.
      const { error: pricesError } = await supabase
        .from("menu_item_prices")
        .insert(cleanPrices.map((p, i) => ({ item_id: insertedItem.id, label: p.label, price: p.price, sort_order: i })));

      if (pricesError) throw pricesError;

      setNewItemForm({ name: "", description: "", imageUrl: "", prices: [{ label: "", price: "" }] });
      await refetch();
      setAdminMessage("Produit cree.");
    } catch (err) {
      const message = toSupabaseErrorMessage(err, "Impossible de creer le produit.");
      console.error("[Admin] createItem failed", err);
      setAdminMessage(`Erreur produit: ${message}`);
      alert(`Impossible de creer le produit: ${message}`);
    } finally {
      setCreatingItem(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setAdminMessage("");
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `menu-images/${fileName}`;

      // Upload first, then compute a permanent public URL for preview/storage.
      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("[Admin] upload image failed", uploadError);
        setAdminMessage(`Erreur upload image: ${uploadError.message}`);
        alert("Erreur upload : " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(filePath);

      setEditForm({ ...editForm, imageUrl: data.publicUrl });
      setAdminMessage("Image envoyee avec succes.");
    } catch (err) {
      const message = toSupabaseErrorMessage(err, "Erreur lors de l'upload");
      console.error("[Admin] handleImageUpload failed", err);
      setAdminMessage(`Erreur upload image: ${message}`);
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const createSauce = async () => {
    const name = newSauceName.trim();
    if (!name) {
      setAdminMessage("Le nom de sauce est requis.");
      return;
    }
    setSavingSauces(true);
    setAdminMessage("");
    try {
      const { error } = await supabase.from("sauces").insert({
        name,
        sort_order: sauces.length,
        is_active: true,
      });
      if (error) throw error;
      setNewSauceName("");
      await refetchSauces();
      setAdminMessage("Sauce ajoutee.");
    } catch (err) {
      const message = toSupabaseErrorMessage(err, "Impossible d'ajouter la sauce.");
      console.error("[Admin] createSauce failed", err);
      setAdminMessage(`Erreur sauces: ${message}`);
      alert(`Impossible d'ajouter la sauce: ${message}`);
    } finally {
      setSavingSauces(false);
    }
  };

  const toggleSauce = async (id: string, nextActive: boolean) => {
    setSavingSauces(true);
    setAdminMessage("");
    try {
      const { error } = await supabase.from("sauces").update({ is_active: nextActive }).eq("id", id);
      if (error) throw error;
      await refetchSauces();
      setAdminMessage("Sauce mise a jour.");
    } catch (err) {
      const message = toSupabaseErrorMessage(err, "Impossible de mettre a jour la sauce.");
      console.error("[Admin] toggleSauce failed", err);
      setAdminMessage(`Erreur sauces: ${message}`);
      alert(`Impossible de mettre a jour la sauce: ${message}`);
    } finally {
      setSavingSauces(false);
    }
  };

  const deleteSauce = async (id: string) => {
    setSavingSauces(true);
    setAdminMessage("");
    try {
      const { error } = await supabase.from("sauces").delete().eq("id", id);
      if (error) throw error;
      await refetchSauces();
      setAdminMessage("Sauce supprimee.");
    } catch (err) {
      const message = toSupabaseErrorMessage(err, "Impossible de supprimer la sauce.");
      console.error("[Admin] deleteSauce failed", err);
      setAdminMessage(`Erreur sauces: ${message}`);
      alert(`Impossible de supprimer la sauce: ${message}`);
    } finally {
      setSavingSauces(false);
    }
  };

  const moveSauce = async (id: string, direction: -1 | 1) => {
    // Reorder by swapping sort_order with adjacent row to keep a stable manual ordering.
    const ordered = [...sauces].sort((a, b) => a.sort_order - b.sort_order);
    const index = ordered.findIndex((s) => s.id === id);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;

    const current = ordered[index];
    const target = ordered[targetIndex];
    setSavingSauces(true);
    setAdminMessage("");
    try {
      const { error: firstError } = await supabase.from("sauces").update({ sort_order: target.sort_order }).eq("id", current.id);
      if (firstError) throw firstError;
      const { error: secondError } = await supabase.from("sauces").update({ sort_order: current.sort_order }).eq("id", target.id);
      if (secondError) throw secondError;
      await refetchSauces();
      setAdminMessage("Ordre des sauces mis a jour.");
    } catch (err) {
      const message = toSupabaseErrorMessage(err, "Impossible de reordonner les sauces.");
      console.error("[Admin] moveSauce failed", err);
      setAdminMessage(`Erreur sauces: ${message}`);
      alert(`Impossible de reordonner les sauces: ${message}`);
    } finally {
      setSavingSauces(false);
    }
  };

  const loading = authLoading || menuLoading;

  if (loading) {
    return (
      <div className="min-h-screen pt-40 sm:pt-32 flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!authenticated || !isAdmin) {
    return (
      <div className="min-h-screen pt-40 sm:pt-32 flex items-center justify-center">
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
    <div className="min-h-screen pt-40 pb-16 sm:pt-32">
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
        {adminMessage && (
          <p className="mb-6 rounded-lg border border-border/60 bg-card px-4 py-3 text-sm text-foreground">
            {adminMessage}
          </p>
        )}

        <Tabs
          value={adminTab}
          onValueChange={(value) => setAdminTab(value as "menu" | "sauces" | "analytics")}
          className="mb-8"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-secondary/40 p-1">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="sauces">Sauces</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>

        {adminTab === "analytics" && (
        <section className="mb-10 rounded-xl border border-border/60 bg-card p-4 card-glow" aria-labelledby="analytics-title">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="analytics-title" className="flex items-center gap-2 font-display text-2xl text-foreground">
              <BarChart3 size={18} className="text-primary" />
              Overview analytics
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={analyticsDays}
                onChange={(e) => setAnalyticsDays(Number(e.target.value) as 7 | 30 | 90)}
                className="rounded-lg border border-border bg-secondary px-2 py-1.5 text-xs text-foreground"
                aria-label="Periode analytics"
              >
                <option value={7}>7 jours</option>
                <option value={30}>30 jours</option>
                <option value={90}>90 jours</option>
              </select>
              <select
                value={analyticsPage}
                onChange={(e) => setAnalyticsPage(e.target.value)}
                className="rounded-lg border border-border bg-secondary px-2 py-1.5 text-xs text-foreground"
                aria-label="Filtre page analytics"
              >
                <option value="all">Toutes les pages</option>
                {pageOptions.map((page) => (
                  <option key={page} value={page}>{page}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => refetchAnalytics()}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
              >
                Rafraichir
              </button>
            </div>
          </div>
          {analyticsLoading && <p className="text-sm text-muted-foreground">Chargement des stats...</p>}
          {analyticsError && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              Impossible de charger les stats: {analyticsError}
            </p>
          )}
          {!analyticsLoading && !analyticsError && analytics && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <p className="text-xs text-muted-foreground">Impressions</p>
                  <p className="text-xl font-semibold text-foreground">{analytics.totalImpressions}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <p className="text-xs text-muted-foreground">Clics</p>
                  <p className="text-xl font-semibold text-foreground">{analytics.totalClicks}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-secondary/40 p-3">
                  <p className="text-xs text-muted-foreground">CTR</p>
                  <p className="text-xl font-semibold text-foreground">{analytics.ctr.toFixed(1)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-border/60 p-3">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Par page</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="text-muted-foreground">
                          <th className="pb-2 text-left font-medium">Page</th>
                          <th className="pb-2 text-right font-medium">Impr.</th>
                          <th className="pb-2 text-right font-medium">Clics</th>
                          <th className="pb-2 text-right font-medium">Top recherche</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.pages.slice(0, 8).map((row) => (
                          <tr key={row.page} className="border-t border-border/50">
                            <td className="py-2 text-foreground">{row.page}</td>
                            <td className="py-2 text-right text-foreground">{row.impressions}</td>
                            <td className="py-2 text-right text-foreground">{row.clicks}</td>
                            <td className="py-2 text-right text-muted-foreground">{row.topSearch}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 p-3">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Top interactions</h3>
                  <ul className="space-y-2 text-xs">
                    {analytics.topTargets.length === 0 && (
                      <li className="text-muted-foreground">Aucun clic enregistre pour le moment.</li>
                    )}
                    {analytics.topTargets.map((target) => (
                      <li key={target.target} className="flex items-center justify-between rounded bg-secondary/40 px-2 py-1.5">
                        <span className="text-foreground">{formatInteractionLabel(target.target)}</span>
                        <span className="font-semibold text-primary">{target.clicks}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
        )}

        {adminTab === "menu" && (
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
        )}

        {adminTab === "sauces" && (
        <div className="mb-10 rounded-xl border border-border/60 bg-card p-4 card-glow">
          <h2 className="mb-3 font-display text-2xl text-foreground">Bar a sauces</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Cette liste alimente automatiquement le bandeau sticky en bas de la page menu.
          </p>
          {saucesError && (
            <p className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              Table sauces indisponible: {saucesError}
            </p>
          )}
          <div className="mb-4 flex gap-2">
            <input
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nouvelle sauce"
              value={newSauceName}
              onChange={(e) => setNewSauceName(e.target.value)}
            />
            <button
              onClick={createSauce}
              disabled={savingSauces || !newSauceName.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Plus size={14} />
              Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {[...sauces]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((sauce, index, arr) => (
                <div
                  key={sauce.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSauce(sauce.id, !sauce.is_active)}
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        sauce.is_active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {sauce.is_active ? "Active" : "Inactive"}
                    </button>
                    <span className="text-sm text-foreground">{sauce.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={savingSauces || index === 0}
                      onClick={() => moveSauce(sauce.id, -1)}
                      className="rounded-md border border-border px-2 py-1 text-foreground hover:bg-primary/10 disabled:opacity-40"
                      aria-label={`Monter ${sauce.name}`}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={savingSauces || index === arr.length - 1}
                      onClick={() => moveSauce(sauce.id, 1)}
                      className="rounded-md border border-border px-2 py-1 text-foreground hover:bg-primary/10 disabled:opacity-40"
                      aria-label={`Descendre ${sauce.name}`}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={savingSauces}
                      onClick={() => deleteSauce(sauce.id)}
                      className="rounded-md border border-border px-2 py-1 text-foreground hover:bg-destructive hover:text-destructive-foreground disabled:opacity-40"
                      aria-label={`Supprimer ${sauce.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        )}

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
        {adminTab === "menu" && (
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
        )}
      </div>
    </div>
  );
};

export default Admin;

