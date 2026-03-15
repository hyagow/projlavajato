
import { createContext, useContext, useState, useEffect } from 'react';

const TicketContext = createContext();

const initialTickets = [
  { id: '1', plate: 'PLX-9988', model: 'Fiat Uno', customer: 'João', phone: '11999999999', status: 'pending', service: 'Simples', price: 40, startTime: new Date().toISOString() },
  { id: '2', plate: 'ABC-1234', model: 'Honda Civic', customer: 'Maria', phone: '11888888888', status: 'washing', service: 'Completa', price: 80, startTime: new Date().toISOString() },
  { id: '3', plate: 'XYZ-5678', model: 'Toyota Corolla', customer: 'Carlos', phone: '11777777777', status: 'ready', service: 'Polimento', price: 300, startTime: new Date().toISOString() },
];

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('lavajato_tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  useEffect(() => {
    localStorage.setItem('lavajato_tickets', JSON.stringify(tickets));
    // Trigger a custom event for same-tab updates if needed, 
    // but primarily we need to handle cross-tab updates.
  }, [tickets]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'lavajato_tickets') {
        setTickets(JSON.parse(e.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addTicket = (ticket) => {
    setTickets((prev) => {
        const newTickets = [...prev, { 
            ...ticket, 
            id: crypto.randomUUID(), 
            startTime: new Date().toISOString(),
            paid: false // default status
        }];
        return newTickets;
    });
  };

  const updateTicketStatus = (id, newStatus) => {
    setTickets((prev) => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const toggleTicketPayment = (id) => {
    setTickets((prev) => prev.map(t => t.id === id ? { ...t, paid: !t.paid } : t));
  };

  const removeTicket = (id) => {
    setTickets((prev) => prev.filter(t => t.id !== id));
  };

  const clearFinishedTickets = () => {
    setTickets((prev) => prev.filter(t => t.status !== 'ready'));
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicketStatus, toggleTicketPayment, removeTicket, clearFinishedTickets }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  return useContext(TicketContext);
}
