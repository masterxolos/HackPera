https://stellar.expert/explorer/testnet/contract/CCNYUUB7MHXYFWCYRUA6IGE2IVUBQUT4JNBPCILH5XDW2CVMWD5CRF6E

stellar contract invoke --source default --network testnet --id CCNYUUB7MHXYFWCYRUA6IGE2IVUBQUT4JNBPCILH5XDW2CVMWD5CRF6E -- get_all_events_with_details

stellar contract invoke --source default --network testnet --id CCNYUUB7MHXYFWCYRUA6IGE2IVUBQUT4JNBPCILH5XDW2CVMWD5CRF6E -- validate_ticket --owner default --ticket_id 0

stellar contract invoke --source default --network testnet --id CCNYUUB7MHXYFWCYRUA6IGE2IVUBQUT4JNBPCILH5XDW2CVMWD5CRF6E -- get_tickets_by_owner --owner default

stellar contract invoke --source default --network testnet --id CCNYUUB7MHXYFWCYRUA6IGE2IVUBQUT4JNBPCILH5XDW2CVMWD5CRF6E -- buy_ticket --event_id 1 --buyer default --payment 10000000
