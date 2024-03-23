import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";
import "../scss/Analysis.scss";

const BASE_URL = "http://localhost:3000/api";
const EXPENSES_ENDPOINT = "/expenses";
const INCOMES_ENDPOINT = "/incomes";

export const Analysis = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
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

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

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

    if (netChartInstance.current) {
      netChartInstance.current.destroy();
    }

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

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div className="chart-container">
        <div className="chart-info">
          <h2 className="text-lg font-semibold mb-2">Expenses</h2>
          <p className="text-sm">
            Total Amount: ${calculateTotal(expenses).toFixed(2)}
          </p>
        </div>
        <div className="chart">
          <canvas
            ref={expensesChartRef}
            style={{ width: "200px", height: "200px" }}
          ></canvas>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-info ">
          <h2 className="text-lg font-semibold mb-2">Incomes</h2>
          <p className="text-sm">
            Total Amount: ${calculateTotal(incomes).toFixed(2)}
          </p>
        </div>
        <div className="chart">
          <canvas
            ref={incomesChartRef}
            style={{ width: "200px", height: "200px" }}
          ></canvas>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-info">
          <h2 className="text-lg font-semibold mb-2">Total</h2>
          <p className="text-sm">
            Net Amount: ${calculateTotal(incomes) - calculateTotal(expenses)}
          </p>
        </div>
        <div className="chart">
          <canvas
            ref={netChartRef}
            style={{ width: "200px", height: "200px" }}
          ></canvas>
        </div>
      </div>
    </div>
  );
};
