        st.markdown("### 📊 Forecast Summary")
        st.markdown(
            f"- **Average forecasted daily sales:** ${avg_forecast:,.2f}\n"
            f"- **Peak day:** {max_day['ds'].date()} — ${max_day['yhat']:,.2f}\n"
            f"- **Lowest day:** {min_day['ds'].date()} — ${min_day['yhat']:,.2f}\n"
            f"- **Sales are projected to {direction} by** ${diff:,.2f} over the forecast period."
        )
