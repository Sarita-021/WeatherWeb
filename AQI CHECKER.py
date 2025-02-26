import requests

# Replace with your actual API keys
OPENWEATHERMAP_API_KEY = '7096190a59f36a0d7b8fe372f243552a'
WEATHER_API_KEY = '7e8bec347d0a4c6f999122949252302'

def get_coordinates(city_name):
    try:
        geocode_url = f'http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={OPENWEATHERMAP_API_KEY}'


        response = requests.get(geocode_url)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        data = response.json()

        if data:
            lat = data[0]['lat']
            lon = data[0]['lon']
            return lat, lon
        else:
            print('No data found for the given city name.')
            return None, None
    except requests.exceptions.RequestException as e:
        print(f'Error fetching coordinates: {e}')
        return None, None

def get_aqi(lat, lon):
    try:
        aqi_url = f'http://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={lat},{lon}&aqi=yes'
        response = requests.get(aqi_url)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        data = response.json()

        if 'current' in data and 'air_quality' in data['current']:
            air_quality = data['current']['air_quality']
            us_epa_aqi = air_quality['us-epa-index']
            pm2_5 = air_quality['pm2_5']
            pm10 = air_quality['pm10']

            return {
                'us_epa_aqi': us_epa_aqi,
                'pm2_5': pm2_5,
                'pm10': pm10
            }
        else:
            print('Air quality data not found in the response.')
            return None
    except requests.exceptions.RequestException as e:
        print(f'Error fetching AQI data: {e}')
        return None

def aqi_description(aqi):
    descriptions = {
        1: "Good",
        2: "Moderate",
        3: "Unhealthy for Sensitive Groups",
        4: "Unhealthy",
        5: "Very Unhealthy",
        6: "Hazardous"
    }
    return descriptions.get(aqi, "Unknown")

if __name__ == '__main__':
    city_name = input("Enter city name: ")
    lat, lon = get_coordinates(city_name)

    if lat and lon:
        aqi_data = get_aqi(lat, lon)
        if aqi_data:
            us_epa_aqi = aqi_data['us_epa_aqi']
            pm2_5 = aqi_data['pm2_5']
            pm10 = aqi_data['pm10']

            print(f'The AQI for {city_name} is {us_epa_aqi} ({aqi_description(us_epa_aqi)}).')
            print(f'PM2.5 concentration: {pm2_5} µg/m³')
            print(f'PM10 concentration: {pm10} µg/m³')
        else:
            print('Failed to retrieve AQI data.')
    else:
        print('Failed to retrieve coordinates.')