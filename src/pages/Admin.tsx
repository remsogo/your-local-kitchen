import { useState } from "react";
import { menuData, MenuCategory, MenuItem } from "@/data/menuData";
import { Lock, Save, Plus, Trash2, Edit2 } from "lucide-react";

const ADMIN_PASSWORD = "pizzatiq2024";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [menu, setMenu] = useState<MenuCategory[]>(() => {
    const saved = localStorage.getItem("pizzatiq_menu");
    return saved ? JSON.parse(saved) : menuData;
  });
  const [editingItem, setEditingItem] = useState<{ catId: string; itemIdx: number } | null>(null);
  const [editForm, setEditForm] = useState<MenuItem>({ name: "", description: "", prices: [] });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    }
  };

  const saveMenu = (newMenu: MenuCategory[]) => {
    setMenu(newMenu);
    localStorage.setItem("pizzatiq_menu", JSON.stringify(newMenu));
  };

  const startEdit = (catId: string, itemIdx: number) => {
    const cat = menu.find((c) => c.id === catId)!;
    setEditingItem({ catId, itemIdx });
    setEditForm({ ...cat.items[itemIdx] });
  };

  const saveEdit = () => {
    if (!editingItem) return;
    const newMenu = menu.map((cat) => {
      if (cat.id !== editingItem.catId) return cat;
      const newItems = [...cat.items];
      newItems[editingItem.itemIdx] = editForm;
      return { ...cat, items: newItems };
    });
    saveMenu(newMenu);
    setEditingItem(null);
  };

  const deleteItem = (catId: string, itemIdx: number) => {
    const newMenu = menu.map((cat) => {
      if (cat.id !== catId) return cat;
      return { ...cat, items: cat.items.filter((_, i) => i !== itemIdx) };
    });
    saveMenu(newMenu);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-card rounded-xl p-8 max-w-sm w-full card-glow">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-primary" />
            <h1 className="font-display text-3xl text-foreground">Admin</h1>
          </div>
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
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-5xl text-gradient text-center mb-8">Tableau de bord</h1>

        <p className="text-center text-sm text-muted-foreground mb-12">
          Modifiez les prix et les descriptions de vos produits. Les changements sont enregistrés localement.
          <br />
          <span className="text-primary">Pour un vrai système d'administration, activez Lovable Cloud.</span>
        </p>

        {/* Editing modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card rounded-xl p-6 max-w-md w-full card-glow">
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
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveEdit}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity"
                >
                  <Save size={16} /> Enregistrer
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
                    key={item.name + idx}
                    className="bg-card rounded-lg p-4 flex items-center justify-between border border-border/50"
                  >
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
