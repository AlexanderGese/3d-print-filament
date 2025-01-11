import { useEffect, useState } from 'react';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { db } from '../lib/firebase';
import { FilamentItem } from '../types';

export function useFirebaseData() {
  const [cartItems, setCartItems] = useState<FilamentItem[]>([]);
  const [orderedItems, setOrderedItems] = useState<FilamentItem[]>([]);
  const [instockItems, setInstockItems] = useState<FilamentItem[]>([]);

  useEffect(() => {
    const cartRef = ref(db, 'cart');
    const orderedRef = ref(db, 'ordered');
    const instockRef = ref(db, 'instock');

    const unsubscribeCart = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.entries(data).map(([id, item]) => ({
        ...(item as Omit<FilamentItem, 'id'>),
        id
      })) : [];
      setCartItems(items);
    });

    const unsubscribeOrdered = onValue(orderedRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.entries(data).map(([id, item]) => ({
        ...(item as Omit<FilamentItem, 'id'>),
        id
      })) : [];
      setOrderedItems(items);
    });

    const unsubscribeInstock = onValue(instockRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.entries(data).map(([id, item]) => ({
        ...(item as Omit<FilamentItem, 'id'>),
        id
      })) : [];
      setInstockItems(items);
    });

    return () => {
      unsubscribeCart();
      unsubscribeOrdered();
      unsubscribeInstock();
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

  return {
    cartItems,
    orderedItems,
    instockItems,
    addItem,
    moveItem,
    deleteItem
  };
}