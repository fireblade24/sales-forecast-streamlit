import streamlit as st
import pandas as pd
from prophet import Prophet
from prophet.plot import plot_plotly

st.set_page_config(page_title="Sales Forecast", layout="wide")

st.title("📈 Sales Forecast App (Powered by Prophet)")

uploaded_file = st.file_uploader("Upload your CSV with 'ds' (date) and 'y' (sales)", type=["csv"])

if uploaded_file:
    try:
        data = pd.read_csv(uploaded_file)
        st.write("🗂️ Preview of Uploaded Data:", data.head())

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

        # 📊 Simple Forecast Summary
        forecast_summary = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods_input)
        avg_forecast = round(forecast_summary['yhat'].mean(), 2)
        max_day = forecast_summary.loc[forecast_summary['yhat'].idxmax()]
        min_day = forecast_summary.loc[forecast_summary['yhat'].idxmin()]
        first = forecast_summary.iloc[0]['yhat']
        last = forecast_summary.iloc[-1]['yhat']
        direction = "increase" if last > first else "decrease"
        diff = round(abs(last - first), 2)

        st.markdown("### 📊 Forecast Summary")
        st.markdown(
            f"- **Average forecasted daily sales:** ${avg_forecast:,.2f}\n"
            f"- **Peak day:** {max_day['ds'].date()} — ${max_day['yhat']:,.2f}\n"
            f"- **Lowest day:** {min_day['ds'].date()} — ${min_day['yhat']:,.2f}\n"
            f"- **Sales are projected to {direction} by** ${diff:,.2f} over the forecast period."
        )

        st.info(
            "💡 **What this means:**\n"
            "Use this forecast to help plan staffing, inventory, or promotions. "
            "If sales are trending down, you might want to adjust your strategy. "
            "If they’re trending up, be prepared for increased demand!"
        )
        st.markdown("### 📅 Daily Forecast with Explanations")

        for _, row in forecast_summary.iterrows():
            date_str = row['ds'].strftime('%A, %B %d')
            yhat = round(row['yhat'], 2)
            lower = round(row['yhat_lower'], 2)
            upper = round(row['yhat_upper'], 2)

            st.markdown(
                f"- **{date_str}**: Expected sales: **${yhat:,.2f}** (range: ${lower:,.2f}–${upper:,.2f}). "
                f"Plan for the higher end if it's a weekend, holiday, or promo day."
            )

        
        
        st.subheader("📋 Forecasted Data Table")
        st.write(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

        csv = forecast.to_csv(index=False).encode('utf-8')
        st.download_button("⬇️ Download Forecast CSV", csv, "forecast.csv", "text/csv")

    except Exception as e:
        st.error("⚠️ Something went wrong. Make sure your file has 'ds' and 'y' columns in the correct format.")
