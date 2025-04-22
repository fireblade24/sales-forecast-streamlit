import streamlit as st
import pandas as pd
from prophet import Prophet
from prophet.plot import plot_plotly

st.set_page_config(page_title="Sales Forecast", layout="wide")

st.title("📈 Sales Forecast App (Powered by Prophet)")

uploaded_file = st.file_uploader("Upload your CSV with 'ds' (date) and 'y' (sales)", type=["csv"])

if uploaded_file:
    data = pd.read_csv(uploaded_file)
    st.write("🗂️ Preview of Uploaded Data:", data.head())

    try:
        data['ds'] = pd.to_datetime(data['ds'])
        data['y'] = pd.to_numeric(data['y'], errors='coerce')

        model = Prophet()
        model.fit(data)

        periods_input = st.number_input("How many days to forecast?", min_value=7, max_value=365, value=30)
        future = model.make_future_dataframe(periods=periods_input)
        forecast = model.predict(future)

        st.subheader("📉 Forecasted Sales")
        fig1 = plot_plotly(model, forecast)
        st.plotly_chart(fig1, use_container_width=True)

        # 📊 Simple Summary
        forecast_summary = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods_input)
        avg_forecast = round(forecast_summary['yhat'].mean(), 2)
        max_day = forecast_summary.loc[forecast_summary['yhat'].idxmax()]
        min_day = forecast_summary.loc[forecast_summary['yhat'].idxmin()]
        first = forecast_summary.iloc[0]['yhat']
        last = forecast_summary.iloc[-1]['yhat']
        direction = "increase" if last > first else "decrease"
        diff = round(abs(last - first), 2)

        st.markdown("###
