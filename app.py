import streamlit as st
import pandas as pd
from prophet import Prophet
from prophet.plot import plot_plotly

st.set_page_config(page_title="Sales Forecast", layout="wide")

st.title("📈 Sales Forecast App (Powered by Prophet)")

uploaded_file = st.file_uploader("Upload your CSV with 'ds' and 'y' columns", type=["csv"])

if uploaded_file:
    data = pd.read_csv(uploaded_file)
    st.write("Preview of Uploaded Data:", data.head())

    data['ds'] = pd.to_datetime(data['ds'])
    data['y'] = pd.to_numeric(data['y'], errors='coerce')

    model = Prophet()
    model.fit(data)

    periods_input = st.number_input("Days to forecast:", min_value=7, max_value=365, value=30)
    future = model.make_future_dataframe(periods=periods_input)
    forecast = model.predict(future)

    st.subheader("Forecast")
    fig1 = plot_plotly(model, forecast)
    st.plotly_chart(fig1, use_container_width=True)

    st.subheader("Forecasted Data Table")
    st.write(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

    csv = forecast.to_csv(index=False).encode('utf-8')
    st.download_button("Download Forecast CSV", csv, "forecast.csv", "text/csv")
