import pandas as pd
import folium

# Lê o arquivo csv
df = pd.read_excel('/Users/henrique/Documents/SECTI/Pontos do Wi-Fi - Henrique Rocha.xlsx')

# Cria um mapa
mapa = folium.Map(location=[-23.5489, -46.6388], zoom_start=12)
mapa.save('mapa.html')

# Cria um marcador para cada linha do arquivo csv
for index, row in df.iterrows():
    folium.Marker([row['lat'], row['lon']], popup=row['nome']).add_to(mapa)


for i in range(len(df)):
    endereco = df.loc[i, 'endereco']
    lat = df.loc[i, 'lat']
    lon = df.loc[i, 'lon']
    popup = endereco
    
marker = folium.Marker(location=[lat, lon], popup=popup)
marker.add_to(mapa)

   
   
geolocator = Nominatim(user_agent="LEieaDr8RQksx8CxwJU0WggnRNj7Xtj2") 