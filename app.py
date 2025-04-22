import streamlit as st
import pandas as pd
from prophet import Prophet
from prophet.plot import plot_plotly

st.set_page_config(page_title="Sales Forecast", layout="wide")
st.title("📈 Sales Forecast App (with Actuals Comparison)")

uploaded_file = st.file_uploader("Upload your historical sales CSV (columns: 'ds', 'y')", type=["csv"])

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

        # 📥 Upload actuals for comparison
        st.markdown("---")
        st.subheader("📌 Upload Actuals to Compare")

        actuals_file = st.file_uploader("Upload Actuals CSV (columns: 'ds', 'y')", type=["csv"], key="actuals")
        if actuals_file:
            actuals = pd.read_csv(actuals_file)
            actuals['ds'] = pd.to_datetime(actuals['ds'])
            actuals.rename(columns={'y': 'actual_y'}, inplace=True)

            merged = pd.merge(forecast_summary, actuals, on='ds', how='left')
            merged['error_abs'] = (merged['actual_y'] - merged['yhat']).abs()
            merged['error_%'] = (merged['error_abs'] / merged['actual_y']) * 100

            st.markdown("### ✅ Forecast vs Actuals")
            st.dataframe(merged[['ds', 'yhat', 'actual_y', 'error_abs', 'error_%']])

            csv = merged.to_csv(index=False).encode('utf-8')
            st.download_button("⬇️ Download Comparison CSV", csv, "forecast_vs_actual.csv", "text/csv")

    except Exception as e:
        st.error("⚠️ There was an error. Please make sure both files use correct column names: 'ds', 'y'.")
