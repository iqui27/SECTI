import os
from flask import Flask, render_template, request
from amadeus import Client, ResponseError
import schedule
import time
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

amadeus = Client(
    client_id='your_amadeus_client_id',
    client_secret='your_amadeus_client_secret'
)

def search_flights(origin, destination, departure_date, return_date, one_way):
    try:
        if one_way:
            response = amadeus.shopping.flight_offers_search.get(
                originLocationCode=origin,
                destinationLocationCode=destination,
                departureDate=departure_date,
                adults=1
            )
        else:
            response = amadeus.shopping.flight_offers_search.get(
                originLocationCode=origin,
                destinationLocationCode=destination,
                departureDate=departure_date,
                returnDate=return_date,
                adults=1
            )
        return response.data
    except ResponseError as error:
        print(error)
        return None

def send_email_alert(to_email, flights):
    # Implemente a função send_email_alert como mostrado na resposta anterior
    pass

def check_flights_daily():
    # Adicione a lógica para obter os parâmetros de busca salvos pelo usuário
    # (por exemplo, de um banco de dados ou arquivo)
    user_email = 'user@example.com'
    origin = 'JFK'
    destination = 'LAX'
    departure_date = '2023-04-01'
    return_date = '2023-04-15'
    one_way = False

    flights = search_flights(origin, destination, departure_date, return_date, one_way)

    if flights:
        # Defina o preço limite para o alerta
        price_threshold = 300
        cheap_flights = [flight for flight in flights if float(flight['price']) <= price_threshold]

        if cheap_flights:
            send_email_alert(user_email, cheap_flights)

schedule.every().day.at("12:00").do(check_flights_daily)



@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        departure_date = request.form.get('departure_date')
        return_date = request.form.get('return_date')
        one_way = request.form.get('one_way')
        origin = request.form.get('origin')
        destination = request.form.get('destination')

        flights = search_flights(origin, destination, departure_date, return_date, one_way)
        return render_template('dashboard.html', flights=flights)

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)

    while True:
        schedule.run_pending()
        time.sleep(60)
