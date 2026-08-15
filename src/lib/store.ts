// SBF Foods — global client state (cart, view, auth, ui)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

export type ViewKey =
  | 'home'
  | 'about'
  | 'products'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'admin'
  | 'distributor'
  | 'contact'
  | 'support';

export interface CartItem {
  slug: string;
  name: string;
  size: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

export interface CouponApplied {
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
}

interface AppState {
  // ---- view routing (SPA) ----
  view: ViewKey;
  productSlug: string | null;
  setView: (view: ViewKey, productSlug?: string | null) => void;

  // ---- cart ----
  cart: CartItem[];
  coupon: CouponApplied | null;
  deliveryFee: number;
  addToCart: (item: CartItem) => void;
  updateQty: (slug: string, size: string, qty: number) => void;
  removeFromCart: (slug: string, size: string) => void;
  clearCart: () => void;
  applyCoupon: (c: CouponApplied | null) => void;
  setDeliveryFee: (fee: number) => void;

  // ---- auth (mock) ----
  authUser: { name: string; email: string; role: 'CUSTOMER' | 'ADMIN' | 'DISTRIBUTOR' } | null;
  login: (email: string, role?: 'CUSTOMER' | 'ADMIN' | 'DISTRIBUTOR') => void;
  logout: () => void;

  // ---- UI ----
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;

  // ---- last order (for tracking + receipt) ----
  lastOrderRef: string | null;
  setLastOrderRef: (ref: string | null) => void;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      view: 'home',
      productSlug: null,
      setView: (view, productSlug = null) => {
        set({ view, productSlug, mobileNavOpen: false });
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const url = new URL(window.location.href);
          url.searchParams.set('view', view);
          if (productSlug) url.searchParams.set('slug', productSlug);
          else url.searchParams.delete('slug');
          window.history.replaceState({}, '', url);
        }
      },

      cart: [],
      coupon: null,
      deliveryFee: 15,
      addToCart: (item) =>
        set((s) => {
          const existing = s.cart.find((c) => c.slug === item.slug && c.size === item.size);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.slug === item.slug && c.size === item.size
                  ? { ...c, quantity: c.quantity + item.quantity }
                  : c
              ),
              cartOpen: true,
            };
          }
          return { cart: [...s.cart, item], cartOpen: true };
        }),
      updateQty: (slug, size, qty) =>
        set((s) => ({
          cart: s.cart
            .map((c) =>
              c.slug === slug && c.size === size ? { ...c, quantity: Math.max(0, qty) } : c
            )
            .filter((c) => c.quantity > 0),
        })),
      removeFromCart: (slug, size) =>
        set((s) => ({ cart: s.cart.filter((c) => !(c.slug === slug && c.size === size)) })),
      clearCart: () => set({ cart: [], coupon: null }),
      applyCoupon: (c) => set({ coupon: c }),
      setDeliveryFee: (fee) => set({ deliveryFee: fee }),

      authUser: null,
      login: (email, role = 'CUSTOMER') =>
        set({
          authUser: {
            name: role === 'ADMIN' ? 'SBF Admin' : role === 'DISTRIBUTOR' ? 'Distributor' : 'Customer',
            email,
            role,
          },
        }),
      logout: () => set({ authUser: null, view: 'home' }),

      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
      mobileNavOpen: false,
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
      chatOpen: false,
      setChatOpen: (open) => set({ chatOpen: open }),

      lastOrderRef: null,
      setLastOrderRef: (ref) => set({ lastOrderRef: ref }),
    }),
    {
      name: 'sbf-foods',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        cart: s.cart,
        coupon: s.coupon,
        authUser: s.authUser,
        lastOrderRef: s.lastOrderRef,
      }),
    }
  )
);

// ---- selectors ----
export const useCartSubtotal = () =>
  useApp((s) => s.cart.reduce((sum, c) => sum + c.unitPrice * c.quantity, 0));

export const useCartCount = () =>
  useApp((s) => s.cart.reduce((sum, c) => sum + c.quantity, 0));

export const useCartTotal = () =>
  useApp(
    useShallow((s) => {
      const subtotal = s.cart.reduce((sum, c) => sum + c.unitPrice * c.quantity, 0);
      let discount = 0;
      if (s.coupon) {
        if (s.coupon.type === 'PERCENT') discount = (subtotal * s.coupon.value) / 100;
        else discount = s.coupon.value;
      }
      return {
        subtotal,
        discount,
        deliveryFee: s.deliveryFee,
        total: Math.max(0, subtotal - discount) + s.deliveryFee,
      };
    })
  );
