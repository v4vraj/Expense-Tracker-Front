import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";

const BASE_URL = "http://localhost:3000/api";
const EXPENSES_ENDPOINT = "/expenses";
const INCOMES_ENDPOINT = "/incomes";

export const Analysis = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const userId = localStorage.getItem("UserId");
  const expensesChartRef = useRef(null);
  const incomesChartRef = useRef(null);
  const netChartRef = useRef(null);
  const expensesChartInstance = useRef(null);
  const incomesChartInstance = useRef(null);
  const netChartInstance = useRef(null);

  const fetchData = async (endpoint, setData) => {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: { userId },
      });
      setData(response.data);
      console.log(`${endpoint} data:`, response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint} data`, error);
    }
  };

  useEffect(() => {
    fetchData(`${EXPENSES_ENDPOINT}/getExpenses`, setExpenses);
    fetchData(`${INCOMES_ENDPOINT}/getIncomes`, setIncomes);
  }, []);

  useEffect(() => {
    const renderChart = (data, chartRef, chartInstance, chartTitle) => {
      if (data.length > 0 && chartRef.current) {
        const categories = data.map((item) => item.description);
        const amounts = data.map((item) => item.amount);

        // Destroy the existing Chart instance if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Create a new doughnut chart
        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: categories,
            datasets: [
              {
                data: amounts,
                backgroundColor: Array.from(
                  { length: categories.length },
                  () =>
                    `rgba(${Math.floor(Math.random() * 128)}, ${Math.floor(
                      Math.random() * 128
                    )}, ${Math.floor(Math.random() * 128)}, 0.7)`
                ),
              },
            ],
          },
          options: {
            responsive: true,
            legend: {
              position: "right",
            },
            tooltips: {
              callbacks: {
                label: (tooltipItem, chartData) => {
                  const label = chartData.labels[tooltipItem.index];
                  const value = chartData.datasets[0].data[tooltipItem.index];
                  return `${label}: ${value}%`;
                },
              },
            },
            title: {
              display: true,
              text: chartTitle,
              fontSize: 16,
            },
            animation: {
              animateScale: true,
              animateRotate: true,
            },
          },
        });
      }
    };

    renderChart(
      expenses,
      expensesChartRef,
      expensesChartInstance,
      "Expense Distribution"
    );
    renderChart(
      incomes,
      incomesChartRef,
      incomesChartInstance,
      "Income Distribution"
    );

    // Calculate net income (income - expenses)
    const netAmount = incomes.reduce(
      (totalIncome, income) => totalIncome + income.amount,
      0
    );

    const netExpense = expenses.reduce(
      (totalExpense, expense) => totalExpense + expense.amount,
      0
    );

    const netCategories = ["Income", "Expenses"];
    const netAmounts = [netAmount, -netExpense];

    // Destroy the existing Net Chart instance if it exists
    if (netChartInstance.current) {
      netChartInstance.current.destroy();
    }

    // Create a new doughnut chart for Net Income
    const netCtx = netChartRef.current.getContext("2d");
    netChartInstance.current = new Chart(netCtx, {
      type: "doughnut",
      data: {
        labels: netCategories,
        datasets: [
          {
            data: netAmounts,
            backgroundColor: Array.from(
              { length: netCategories.length },
              () =>
                `rgba(${Math.floor(Math.random() * 128)}, ${Math.floor(
                  Math.random() * 128
                )}, ${Math.floor(Math.random() * 128)}, 0.7)`
            ),
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: "right",
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, chartData) => {
              const label = chartData.labels[tooltipItem.index];
              const value = chartData.datasets[0].data[tooltipItem.index];
              return `${label}: ${value >= 0 ? "+" : ""}${value}%`;
            },
          },
        },
        title: {
          display: true,
          text: "Net Income Distribution",
          fontSize: 16,
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      },
    });
  }, [expenses, incomes]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ margin: "50px", display: "inline-block" }}>
        <canvas ref={expensesChartRef} width="300px" height="300px"></canvas>
      </div>
      <div style={{ margin: "50px", display: "inline-block" }}>
        <canvas ref={incomesChartRef} width="300px" height="300px"></canvas>
      </div>
      <div style={{ margin: "50px", display: "inline-block" }}>
        <canvas ref={netChartRef} width="300px" height="300px"></canvas>
      </div>
    </div>
  );
};
