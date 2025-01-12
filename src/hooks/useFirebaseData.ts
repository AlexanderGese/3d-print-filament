import { useEffect, useState } from 'react';
    import { ref, onValue, push, set, remove } from 'firebase/database';
    import { db } from '../lib/firebase';
    import { FilamentItem, Store, PreconfigFilament } from '../types';

    export function useFirebaseData() {
      const [cartItems, setCartItems] = useState<FilamentItem[]>([]);
      const [orderedItems, setOrderedItems] = useState<FilamentItem[]>([]);
      const [instockItems, setInstockItems] = useState<FilamentItem[]>([]);
      const [stores, setStores] = useState<Store[]>([]);
      const [preconfigs, setPreconfigs] = useState<PreconfigFilament[]>([]);
      
      useEffect(() => {
        let isMounted = true;
        const cartRef = ref(db, 'cart');
        const orderedRef = ref(db, 'ordered');
        const instockRef = ref(db, 'instock');
        const storesRef = ref(db, 'stores');
        const preconfigsRef = ref(db, 'preconfigs');

        const unsubscribeCart = onValue(cartRef, (snapshot) => {
          if (isMounted) {
            const data = snapshot.val();
            const items = data ? Object.entries(data).map(([id, item]) => ({
              ...(item as Omit<FilamentItem, 'id'>),
              id
            })) : [];
            setCartItems(items);
          }
        });

        const unsubscribeOrdered = onValue(orderedRef, (snapshot) => {
          if (isMounted) {
            const data = snapshot.val();
            const items = data ? Object.entries(data).map(([id, item]) => ({
              ...(item as Omit<FilamentItem, 'id'>),
              id
            })) : [];
            setOrderedItems(items);
          }
        });

        const unsubscribeInstock = onValue(instockRef, (snapshot) => {
          if (isMounted) {
            const data = snapshot.val();
            const items = data ? Object.entries(data).map(([id, item]) => ({
              ...(item as Omit<FilamentItem, 'id'>),
              id
            })) : [];
            setInstockItems(items);
          }
        });

        const unsubscribeStores = onValue(storesRef, (snapshot) => {
          if (isMounted) {
            const data = snapshot.val();
             const items = data ? Object.entries(data).map(([id, item]) => ({
              ...(item as Omit<Store, 'id'>),
              id
            })) : [];
            setStores(items);
          }
        });

        const unsubscribePreconfigs = onValue(preconfigsRef, (snapshot) => {
          if (isMounted) {
            const data = snapshot.val();
            const items = data ? Object.entries(data).map(([id, item]) => ({
              ...(item as Omit<PreconfigFilament, 'id'>),
              id
            })) : [];
            setPreconfigs(items);
          }
        });

        return () => {
          isMounted = false;
          unsubscribeCart();
          unsubscribeOrdered();
          unsubscribeInstock();
          unsubscribeStores();
          unsubscribePreconfigs();
        };
      }, []);

      const addItem = async (item: Omit<FilamentItem, 'id'>) => {
        const cartRef = ref(db, 'cart');
        const newItemRef = push(cartRef);
        await set(newItemRef, item);
      };

      const moveItem = async (item: FilamentItem, fromList: string, toList: string) => {
        const { id, ...itemWithoutId } = item;
        await remove(ref(db, `${fromList}/${id}`));
        const newRef = push(ref(db, toList));
        await set(newRef, itemWithoutId);
      };

      const deleteItem = async (id: string, list: string) => {
        await remove(ref(db, `${list}/${id}`));
      };

      const addStore = async (store: Omit<Store, 'id'>) => {
        const storesRef = ref(db, 'stores');
        const newStoreRef = push(storesRef);
        await set(newStoreRef, store);
      };

      const addPreconfig = async (preconfig: Omit<PreconfigFilament, 'id'>) => {
        const preconfigsRef = ref(db, 'preconfigs');
        const newPreconfigRef = push(preconfigsRef);
        await set(newPreconfigRef, preconfig);
      };

      const deleteStore = async (id: string) => {
        await remove(ref(db, `stores/${id}`));
      };

      const deletePreconfig = async (id: string) => {
        await remove(ref(db, `preconfigs/${id}`));
      };

      return {
        cartItems,
        orderedItems,
        instockItems,
        stores,
        preconfigs,
        addItem,
        moveItem,
        deleteItem,
        addStore,
        addPreconfig,
        deleteStore,
        deletePreconfig
      };
    }
