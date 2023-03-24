from amadeus import Client, ResponseError

class AmadeusAPI:
    def __init__(self, client_id, client_secret):
        self.amadeus = Client(
            client_id=client_id,
            client_secret=client_secret
        )

    def search_flights(self, origin, destination, departure_date, return_date=None, one_way=False):
        try:
            if one_way:
                response = self.amadeus.shopping.flight_offers_search.get(
                    originLocationCode=origin,
                    destinationLocationCode=destination,
                    departureDate=departure_date,
                    adults=1
                )
            else:
                response = self.amadeus.shopping.flight_offers_search.get(
                    originLocationCode=origin,
                    destinationLocationCode=destination,
                    departureDate=departure_date,
                    returnDate=return_date,
                    adults=1
                )

            flights = []
            for offer in response.data:
                flight_info = {
                    'details': 'Adicione os detalhes do voo aqui',
                    'price': offer['price']['total']
                }
                flights.append(flight_info)

            return flights
        except ResponseError as error:
            print(error)
            return None
