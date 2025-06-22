#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Bytes, Env, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug)]
pub struct Ticket {
    pub used: bool,
    pub event_id: u32,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Event {
    pub name: Symbol,
    pub description: Bytes,
    pub datetime: Bytes,
    pub location: Bytes,
    pub organizer: Symbol,
    pub image_url: Bytes,
    pub max_tickets: u32,
    pub sold: u32,
    pub price: i128, // price in stroops (1 XLM = 10^7 stroops)
}

#[contracttype]
pub enum DataKey {
    Event(u32),
    Ticket(Address, u32),
    EventList,
}

#[contract]
pub struct TicketContract;

#[contractimpl]
impl TicketContract {
    pub fn create_event(
        env: Env,
        id: u32,
        name: Symbol,
        description: Bytes,
        datetime: Bytes,
        location: Bytes,
        organizer: Symbol,
        image_url: Bytes,
        max_tickets: u32,
        price: i128,
    ) {
        let key = DataKey::Event(id);
        let event = Event {
            name,
            description,
            datetime,
            location,
            organizer,
            image_url,
            max_tickets,
            sold: 0,
            price,
        };
        env.storage().persistent().set(&key, &event);

        let mut list = env
            .storage()
            .persistent()
            .get::<_, Vec<u32>>(&DataKey::EventList)
            .unwrap_or(Vec::new(&env));
        list.push_back(id);
        env.storage().persistent().set(&DataKey::EventList, &list);
    }

    pub fn get_all_events_with_details(env: Env) -> Vec<Event> {
        let ids = env
            .storage()
            .persistent()
            .get::<_, Vec<u32>>(&DataKey::EventList)
            .unwrap_or(Vec::new(&env));

        let mut events = Vec::new(&env);
        for id in ids.iter() {
            let key = DataKey::Event(id);
            if let Some(event) = env.storage().persistent().get::<_, Event>(&key) {
                events.push_back(event);
            }
        }
        events
    }

    pub fn buy_ticket(env: Env, event_id: u32, buyer: Address, payment: i128) {
        let key = DataKey::Event(event_id);
        let mut event: Event = env
            .storage()
            .persistent()
            .get(&key)
            .expect("event not found");

        if event.sold >= event.max_tickets {
            panic!("Sold out");
        }

        if payment < event.price {
            panic!("Insufficient payment");
        }

        let ticket_id = event.sold;
        event.sold += 1;
        env.storage().persistent().set(&key, &event);

        let ticket_key = DataKey::Ticket(buyer.clone(), ticket_id);
        let ticket = Ticket {
            used: false,
            event_id,
        };
        env.storage().persistent().set(&ticket_key, &ticket);
    }

    pub fn get_tickets_by_owner(env: Env, owner: Address) -> Vec<u32> {
        let mut tickets = Vec::new(&env);
        for i in 0..1000 {
            let key = DataKey::Ticket(owner.clone(), i);
            if env.storage().persistent().has(&key) {
                tickets.push_back(i);
            } else {
                break;
            }
        }
        tickets
    }

    pub fn validate_ticket(env: Env, owner: Address, ticket_id: u32) -> bool {
        let key = DataKey::Ticket(owner.clone(), ticket_id);
        let mut ticket: Ticket = env
            .storage()
            .persistent()
            .get(&key)
            .expect("ticket not found");

        if ticket.used {
            return false;
        }

        ticket.used = true;
        env.storage().persistent().set(&key, &ticket);
        true
    }
}
