import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
  withSequence,
} from "react-native-reanimated";
import { Linking } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import SvgComponent from "../../assets/images/PaymentIcon";
import ClipboardCheckIcon from "../../assets/images/ClipboardCheckIcon";
import OrderIcon from "../../assets/images/OrderIcon";
import AlertTriangleIcon from "../../assets/images/AlertTriangleIcon";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import NotificationIcon from "../../assets/images/NotificationIcon";
// import ImageIcon from "../../assets/images/image";

const screenWidth = Dimensions.get("window").width;

// Enhanced dummy data for charts with multiple metrics
const initialData = {
  totalSales: 250.51,
  totalSalesChange: 146,
  orders: 50,
  ordersChange: 52,
  conversionRate: 1.01,
  conversionRateChange: 80,
  sessions: 296,
  sessionsChange: -17,
  chartData: {
    totalSales: {
      labels: ["6:00 AM", "10:00 AM", "4:00 PM", "8:00 PM", "12:00 AM"],
      datasets: [
        {
          data: [50, 170, 120, 250, 200, 50],
          color: () => "#36D7B7",
          strokeWidth: 2,
        },
      ],
    },
    orders: {
      labels: ["6:00 AM", "10:00 AM", "4:00 PM", "8:00 PM", "12:00 AM"],
      datasets: [
        {
          data: [5, 20, 10, 35, 25, 5],
          color: () => "#FF6B6B",
          strokeWidth: 2,
        },
      ],
    },
    conversionRate: {
      labels: ["6:00 AM", "10:00 AM", "4:00 PM", "8:00 PM", "12:00 AM"],
      datasets: [
        {
          data: [0.5, 2.1, 1.0, 1.5, 0.8, 0.3],
          color: () => "#FFD166",
          strokeWidth: 2,
        },
      ],
    },
    sessions: {
      labels: ["6:00 AM", "10:00 AM", "4:00 PM", "8:00 PM", "12:00 AM"],
      datasets: [
        {
          data: [30, 100, 70, 150, 120, 30],
          color: () => "#06D6A0",
          strokeWidth: 2,
        },
      ],
    },
  },
  ordersFulfill: 50,
  paymentCapture: 1,
  highRiskOrders: 3,
  chargebacks: 7,
};

// Default data for ranges with percentage changes (fallback if AsyncStorage fails)
const defaultRangeData = {
  Today: {
    totalSales: 250.51,
    totalSalesChange: 146,
    orders: 50,
    ordersChange: 52,
    conversionRate: 1.01,
    conversionRateChange: 80,
    sessions: 296,
    sessionsChange: -17,
    ordersFulfill: 50,
    paymentCapture: 1,
    highRiskOrders: 3,
    chargebacks: 7,
  },
  Yesterday: {
    totalSales: 180.25,
    totalSalesChange: 95,
    orders: 35,
    ordersChange: 28,
    conversionRate: 0.95,
    conversionRateChange: 65,
    sessions: 210,
    sessionsChange: -22,
    ordersFulfill: 35,
    paymentCapture: 0,
    highRiskOrders: 2,
    chargebacks: 4,
  },
  "Last 7 days": {
    totalSales: 1250.84,
    totalSalesChange: 118,
    orders: 210,
    ordersChange: 75,
    conversionRate: 1.25,
    conversionRateChange: 90,
    sessions: 1500,
    sessionsChange: -8,
    ordersFulfill: 15,
    paymentCapture: 3,
    highRiskOrders: 8,
    chargebacks: 12,
  },
  "Last 30 days": {
    totalSales: 5280.32,
    totalSalesChange: 152,
    orders: 860,
    ordersChange: 88,
    conversionRate: 1.42,
    conversionRateChange: 110,
    sessions: 6400,
    sessionsChange: -5,
    ordersFulfill: 25,
    paymentCapture: 5,
    highRiskOrders: 15,
    chargebacks: 22,
  },
  "Last 90 days": {
    totalSales: 15840.75,
    totalSalesChange: 135,
    orders: 2580,
    ordersChange: 62,
    conversionRate: 1.38,
    conversionRateChange: 94,
    sessions: 19200,
    sessionsChange: -12,
    ordersFulfill: 42,
    paymentCapture: 8,
    highRiskOrders: 35,
    chargebacks: 40,
  },
  "Last 365 days": {
    totalSales: 62500.18,
    totalSalesChange: 128,
    orders: 9850,
    ordersChange: 58,
    conversionRate: 1.31,
    conversionRateChange: 85,
    sessions: 75000,
    sessionsChange: -10,
    ordersFulfill: 85,
    paymentCapture: 12,
    highRiskOrders: 120,
    chargebacks: 95,
  },
  "Last month": {
    totalSales: 4950.45,
    totalSalesChange: 140,
    orders: 790,
    ordersChange: 72,
    conversionRate: 1.35,
    conversionRateChange: 92,
    sessions: 5800,
    sessionsChange: -15,
    ordersFulfill: 30,
    paymentCapture: 4,
    highRiskOrders: 12,
    chargebacks: 18,
  },
  "Last 12 Months": {
    totalSales: 58700.92,
    totalSalesChange: 125,
    orders: 9100,
    ordersChange: 55,
    conversionRate: 1.29,
    conversionRateChange: 78,
    sessions: 70500,
    sessionsChange: -8,
    ordersFulfill: 75,
    paymentCapture: 10,
    highRiskOrders: 110,
    chargebacks: 85,
  },
  "Custom range": {
    totalSales: 3254.68,
    totalSalesChange: 105,
    orders: 520,
    ordersChange: 48,
    conversionRate: 1.18,
    conversionRateChange: 68,
    sessions: 4400,
    sessionsChange: -20,
    ordersFulfill: 28,
    paymentCapture: 3,
    highRiskOrders: 9,
    chargebacks: 14,
  },
};

const Index = () => {
  const [selectedDateRange, setSelectedDateRange] = useState("Today");
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(initialData);
  const [rangeDataMap, setRangeDataMap] = useState(defaultRangeData);
  const [isActive, setIsActive] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Default Name",
    image: null,
    noOfActiveUsers: 0,
  });

  // Available metrics (now in fixed order as per requirement)
  const metrics = ["Total sales", "Orders", "Conversion rate", "Sessions"];
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);

  // Create a state variable to store the generated chart data
  const [generatedChartData, setGeneratedChartData] = useState({});

  // Previous index to determine animation direction
  const [prevIndex, setPrevIndex] = useState(0);

  // Animation values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Create animated styles for the metrics header
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });

  // Add new state for refresh control
  const [refreshing, setRefreshing] = useState(false);

  // Add new animated value for refresh animation
  const refreshHeight = useSharedValue(0);

  // Create animated style for the refresh container
  const refreshContainerStyle = useAnimatedStyle(() => {
    return {
      height: refreshHeight.value,
      opacity: refreshHeight.value / 60, // Fade in as we pull down
    };
  });

  // Modify the onRefresh function
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    // Animate the refresh container
    refreshHeight.value = withSequence(
      withSpring(60), // Pull down to 60
      withTiming(0, { duration: 300 }) // Animate back up
    );

    // Minimum refresh time of 1.5 seconds for better UX
    const minimumRefreshTime = new Promise((resolve) =>
      setTimeout(resolve, 1500)
    );

    // Your existing data reload
    const dataReload = loadAndGenerateData();

    // Wait for both minimum time and data reload
    Promise.all([minimumRefreshTime, dataReload]).then(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedProfileData = await AsyncStorage.getItem("dotsDetails");
        if (savedProfileData) {
          setProfileData(JSON.parse(savedProfileData));
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  // Function to animate the header when metrics change
  const animateHeaderTransition = (newIndex) => {
    // Determine direction of animation (left or right)
    // console.log("newIndex", newIndex);

    let direction = newIndex > prevIndex ? -1 : 1;

    // Account for loop behavior
    if (newIndex === 0 && prevIndex === metrics.length - 1) {
      // Moving right from last item to first
      direction = -1;
    } else if (newIndex === metrics.length - 1 && prevIndex === 0) {
      // Moving left from first item to last
      direction = 1;
    }

    // Start exit animation
    opacity.value = withTiming(0, { duration: 150 });
    translateX.value = withTiming(
      direction * 100,
      {
        duration: 200,
        easing: Easing.out(Easing.ease),
      },
      () => {
        // Update metrics index after exit animation
        runOnJS(setSelectedMetricIndex)(newIndex);
        runOnJS(setPrevIndex)(newIndex);

        // Reset position for entry animation
        translateX.value = -direction * 100;

        // Start entry animation
        opacity.value = withTiming(1, { duration: 150 });
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
      }
    );
  };

  // Modify the loadRangeData function to store the generated chart data
  const loadRangeData = async () => {
    try {
      const savedRangeData = await AsyncStorage.getItem("dashboardRangeData");
      let data = savedRangeData ? JSON.parse(savedRangeData) : defaultRangeData;

      // Create a temporary object to store generated chart data
      const chartDataMap = {};

      // Generate chart data for each range if it doesn't exist
      Object.keys(data).forEach((range) => {
        const labels = generateTimeLabels(range);
        chartDataMap[range] = {
          totalSales: generateChartData(data[range].totalSales, labels.length),
          orders: generateChartData(data[range].orders, labels.length),
          conversionRate: generateChartData(
            data[range].conversionRate,
            labels.length
          ),
          sessions: generateChartData(data[range].sessions, labels.length),
        };
      });

      // Set the generated chart data
      setGeneratedChartData(chartDataMap);

      // Save the enhanced data back to storage
      await AsyncStorage.setItem("dashboardRangeData", JSON.stringify(data));
      setRangeDataMap(data);
      updateDataForDateRange(selectedDateRange);
    } catch (error) {
      console.error("Failed to load dashboard range data:", error);
    }
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const response = await fetch(
          "https://bug-x.vercel.app/features/squeeze-benz"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setIsActive(data.feature.isActive);
      } catch (error) {
        console.error("Failed to fetch data from API:", error);
      }
    };

    // Call the fetchDataFromAPI function
    fetchDataFromAPI();
  }, []);

  // Use the loadRangeData function in useEffect
  useEffect(() => {
    loadRangeData();
  }, []); // Load data whenever the page is accessed or the selected metric/date range changes

  // Update data when date range changes
  const loadAndGenerateData = async () => {
    try {
      const savedRangeData = await AsyncStorage.getItem("dashboardRangeData");
      let data = savedRangeData ? JSON.parse(savedRangeData) : defaultRangeData;

      // Create a temporary object to store newly generated chart data
      const chartDataMap = {};

      // Always regenerate chart data for all ranges
      Object.keys(data).forEach((range) => {
        const labels = generateTimeLabels(range);
        chartDataMap[range] = {
          totalSales: generateChartData(data[range].totalSales, labels.length),
          orders: generateChartData(data[range].orders, labels.length),
          conversionRate: generateChartData(
            data[range].conversionRate,
            labels.length
          ),
          sessions: generateChartData(data[range].sessions, labels.length),
        };
      });

      // Set the generated chart data immediately
      setGeneratedChartData(chartDataMap);

      // Save the enhanced data back to storage
      await AsyncStorage.setItem("dashboardRangeData", JSON.stringify(data));
      setRangeDataMap(data);
      updateDataForDateRange(selectedDateRange);
    } catch (error) {
      console.error("Failed to load and generate dashboard data:", error);
    }
  };
  useEffect(() => {
    loadAndGenerateData();
  }, [selectedDateRange]);

  const updateDataForDateRange = (range) => {
    // Get data for the selected date range
    const rangeData = rangeDataMap[range] || defaultRangeData[range];

    // Create a new dashboard data object with chart data and the range data
    const newDashboardData = {
      ...initialData, // Keep the chart data
      ...rangeData, // Apply the range-specific data
    };

    // Update the dashboard data
    setDashboardData(newDashboardData);
  };

  // Update the generateTimeLabels function to handle all date ranges correctly
  const generateTimeLabels = (range) => {
    const today = new Date();

    switch (range) {
      case "Today":
      case "Yesterday": {
        // Generate 15 time points throughout the day with clean formats
        const labels = [];
        for (let i = 0; i < 15; i++) {
          const hour = Math.floor((i * 24) / 15);
          const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
          const ampm = hour < 12 ? "AM" : "PM";
          // Add minutes to display format (always :00)
          labels.push(`${formattedHour}:00 ${ampm}`);
        }
        return labels;
      }

      case "Last 7 days": {
        // Generate 15 points over 7 days with day names
        const labels = [];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (let i = 0; i < 15; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - Math.floor((i * 7) / 15));
          // Use day name for better readability
          labels.push(dayNames[date.getDay()]);
        }
        return labels;
      }

      case "Last 30 days": {
        const labels = [];
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        for (let i = 0; i < 15; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - Math.floor((i * 30) / 15));
          // Use month + day format
          labels.push(`${monthNames[date.getMonth()]} ${date.getDate()}`);
        }
        return labels;
      }

      case "Last 90 days": {
        const labels = [];
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        for (let i = 0; i < 15; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - Math.floor((i * 90) / 15));
          // Use month + day format
          labels.push(`${monthNames[date.getMonth()]} ${date.getDate()}`);
        }
        return labels;
      }

      case "Last 365 days": {
        const labels = [];
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        for (let i = 0; i < 15; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - Math.floor((i * 365) / 15));
          // For very long periods, show month and year
          labels.push(
            `${monthNames[date.getMonth()]} ${date
              .getFullYear()
              .toString()
              .substr(2)}`
          );
        }
        return labels;
      }

      case "Last month": {
        const labels = [];
        // Get the previous month
        const prevMonth = new Date(today);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        const daysInMonth = new Date(
          prevMonth.getFullYear(),
          prevMonth.getMonth() + 1,
          0
        ).getDate();

        for (let i = 0; i < 15; i++) {
          const day = Math.ceil(((i + 1) * daysInMonth) / 15);
          const date = new Date(
            prevMonth.getFullYear(),
            prevMonth.getMonth(),
            day
          );
          labels.push(`${date.getDate()}`); // Just show the day number
        }
        return labels;
      }

      case "Last 12 Months": {
        const labels = [];
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        for (let i = 0; i < 15; i++) {
          const date = new Date(today);
          date.setMonth(today.getMonth() - Math.floor((i * 12) / 15));
          // Show month and year abbreviation
          labels.push(
            `${monthNames[date.getMonth()]} ${date
              .getFullYear()
              .toString()
              .substr(2)}`
          );
        }
        return labels;
      }

      case "Custom range":
        // For custom range, show generic date markers
        return Array(15)
          .fill("")
          .map((_, i) => `Day ${i + 1}`);

      default:
        return Array(15)
          .fill("")
          .map((_, i) => {
            const hour = Math.floor((i * 24) / 15);
            const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
            const ampm = hour < 12 ? "AM" : "PM";
            return `${formattedHour}:00 ${ampm}`;
          });
    }
  };

  // Update the generateChartData function to create randomized data points
  const generateChartData = (total, pointCount) => {
    // Ensure pointCount is 15
    const actualPointCount = 15;
    const points = [];

    // Calculate an average value around which to randomize
    const avgValue = total / actualPointCount;

    // Generate randomized values that approximately sum to total
    let runningTotal = 0;

    for (let i = 0; i < actualPointCount; i++) {
      if (i === actualPointCount - 1) {
        // Make the last point balance to the total
        points.push(Math.max(0, total - runningTotal));
      } else {
        // Generate a random value that's between 50% and 150% of the average
        const randomFactor = 0.5 + Math.random(); // between 0.5 and 1.5
        const value = Math.round(avgValue * randomFactor);
        points.push(value);
        runningTotal += value;
      }
    }

    return points;
  };

  // Add a function to generate the secondary dotted line data
  const generateSecondaryChartData = (primaryData) => {
    return primaryData.map((value, index) => {
      // Alternate between multiplying by 1.3 and 0.8 to create variation
      const factor = index % 2 === 0 ? 1.3 : 0.8;
      return Math.round(value * factor);
    });
  };

  // Modify the getMetricChartData function to include the secondary line
  const getMetricChartData = (metric) => {
    const labels = generateTimeLabels(selectedDateRange);
    const storedChartData = generatedChartData[selectedDateRange];

    let primaryData = [];
    if (storedChartData) {
      let values = [];
      switch (metric) {
        case "Total sales":
          values = storedChartData.totalSales;
          break;
        case "Orders":
          values = storedChartData.orders;
          break;
        case "Conversion rate":
          values = storedChartData.conversionRate;
          break;
        case "Sessions":
          values = storedChartData.sessions;
          break;
      }

      primaryData = values.map((value, index) => ({
        value,
        label: labels[index] || "",
        dataPointText: "",
      }));
    } else {
      primaryData = Array(15)
        .fill(0)
        .map((_, index) => ({
          value: 0,
          label: labels[index] || "",
          dataPointText: "",
        }));
    }

    // Generate more varied secondary data
    const secondaryData = primaryData.map((item, index) => {
      // Create more dramatic variations between primary and secondary data
      let factor;
      if (index === 0 || index === primaryData.length - 1) {
        // Ensure start and end points are notably different
        factor = index === 0 ? 0.5 : 1.8;
      } else {
        // Create a wave-like pattern for middle points
        factor = 1 + Math.sin(index * (Math.PI / 4)) * 0.5;
      }

      const secondaryValue = Math.round(item.value * factor);

      return {
        value: secondaryValue,
        label: item.label,
        dataPointText: "",
        isDotted: true,
      };
    });

    return { primaryData, secondaryData };
  };

  // Get the chart color based on the metric
  const getChartColor = (metric) => {
    switch (metric) {
      case "Total sales":
        return "#36D7B7";
      case "Orders":
        return "#FF6B6B";
      case "Conversion rate":
        return "#FFD166";
      case "Sessions":
        return "#06D6A0";
      default:
        return "#36D7B7";
    }
  };

  const getMetricValue = (metric) => {
    switch (metric) {
      case "Total sales":
        return `$${Number(dashboardData.totalSales || 0).toFixed(2)}`;
      case "Orders":
        return String(dashboardData.orders || 0);
      case "Conversion rate":
        return `${dashboardData.conversionRate || 0}%`;
      case "Sessions":
        return String(dashboardData.sessions || 0);
      default:
        return `${dashboardData.conversionRate || 0}%`;
    }
  };

  const getMetricChange = (metric) => {
    // Get percentage change from the dashboard data
    switch (metric) {
      case "Total sales":
        return dashboardData.totalSalesChange || 0;
      case "Orders":
        return dashboardData.ordersChange || 0;
      case "Conversion rate":
        return dashboardData.conversionRateChange || 0;
      case "Sessions":
        return dashboardData.sessionsChange || 0;
      default:
        return 0;
    }
  };

  // Render change indicator with correct arrow
  const renderChangeIndicator = (value, isMain) => {
    const numValue = Number(value);
    const isPositive = !isNaN(numValue) && numValue >= 0;
    if (numValue === 0) {
      return null;
    }

    return (
      <Text
        style={[
          styles.metricChange,
          isPositive ? styles.positiveChange : styles.negativeChange,
          {
            fontSize: isMain ? 14 : 10,
            width: isMain ? undefined : 50,
            alignSelf: "flex-start",
            color: isMain ? (isPositive ? "#288A5B" : "#A7A7A7") : "#A7A7A7",
            lineHeight: isMain ? 18 : 14, // Adjust line height to reduce gap
          },
        ]}
      >
        {isPositive ? (
          <Feather
            name="arrow-up-right"
            size={isMain ? 18 : 12}
            color={isMain ? "#288A5B" : "#A7A7A7"}
            style={{ marginRight: 2 }} // Reduce space between icon and text
          />
        ) : (
          <Feather
            name="arrow-down-right"
            size={isMain ? 18 : 12}
            color="#A7A7A7"
            style={{ marginRight: 2 }} // Reduce space between icon and text
          />
        )}
        {Math.abs(numValue)}%
      </Text>
    );
  };

  // Now update the renderMetricItem function to render both lines
  const renderMetricItem = ({ item: metric, index }) => {
    const { primaryData, secondaryData } = getMetricChartData(metric);
    const color = getChartColor(metric);

    // Extract only 3 labels - start, middle, and end
    const timeLabels = [
      primaryData[0]?.label || "", // First label
      primaryData[7]?.label || "", // Middle label
      primaryData[14]?.label || "", // Last label
    ];

    // Enhanced formatYLabel function
    const formatYLabel = (value) => {
      let formattedValue = value;
      if (value >= 1000000) {
        formattedValue = (value / 1000000).toFixed(0) + "M";
      } else if (value >= 1000) {
        formattedValue = (value / 1000).toFixed(0) + "k";
      } else if (value >= 100) {
        // Round to nearest hundred for values between 100 and 1000
        formattedValue = Math.round(value / 100) * 100;
      }

      // Add dollar sign if it's Total sales
      if (metric === "Total sales") {
        return `$${formattedValue}`;
      }
      return formattedValue;
    };

    // Ensure we have valid chart data
    if (!primaryData || primaryData.length === 0) {
      console.log("No chart data available for", metric);
      // Return a placeholder or empty chart
      return (
        <View
          style={[
            styles.metricPage,
            {
              backgroundColor: "white",
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
              height: 140,
            },
          ]}
        >
          <Text>Loading chart data...</Text>
        </View>
      );
    }

    // Process the chart data to only show specific labels
    const processedPrimaryData = primaryData.map((item, i) => {
      // Only show labels at specific intervals
      const showLabel = i === 0 || i === 7 || i === 14;
      return {
        ...item,
        label: showLabel ? item.label : "",
      };
    });

    // Process secondary data the same way
    const processedSecondaryData = secondaryData.map((item, i) => {
      const showLabel = i === 0 || i === 7 || i === 14;
      return {
        ...item,
        label: showLabel ? item.label : "",
      };
    });

    return (
      <View
        style={[
          styles.metricPage,
          {
            backgroundColor: "white",
            borderRadius: 12,
          },
        ]}
      >
        <LineChart
          key={`${metric}-${selectedDateRange}-${JSON.stringify(
            processedPrimaryData
          )}`}
          data={processedPrimaryData}
          secondaryData={processedSecondaryData}
          yAxisTextStyle={{ color: "#848485", fontSize: 10 }}
          height={120}
          width={screenWidth - 90}
          noOfSections={3}
          spacing={screenWidth / processedPrimaryData.length}
          color={"#12ABF0"}
          thickness={2}
          startFillColor={"#12ABF0"}
          endFillColor="transparent"
          startOpacity={0.3}
          endOpacity={0.01}
          secondaryLineConfig={{
            color: "#0696D4",
            thickness: 1.5,
            strokeDashArray: [2, 4],
            curved: true,
          }}
          textColor="#555555"
          initialSpacing={0}
          hideRules={false}
          hideDataPoints={false}
          dataPointsColor="#12ABF0"
          dataPointsRadius={5}
          showDataPointOnPress={true}
          yAxisColor="transparent"
          xAxisColor="#EEEEEE"
          rulesColor="#DDDDDD"
          verticalLinesColor="rgba(14,164,164,0.5)"
          rulesType="solid"
          xAxisLabelTextStyle={{
            height: 0,
            width: 0,
          }}
          yAxisLabelTextStyle={{
            fontSize: 9,
            fontWeight: "600",
            textAlign: "center",
            color: "#555555",
            padding: 5,
            margin: 2,
          }}
          formatYLabel={formatYLabel}
          // pointerConfig={{
          //   // radius: 5,
          //   // pointerColor: "#12ABF0",
          //   pointerLabelWidth: 100,
          //   pointerLabelHeight: 35,
          //   activatePointersOnLongPress: true,
          //   autoConfigurePointer: true,
          //   pointerStripHeight: 160,
          //   // pointerStripColor: "lightgray",
          //   // pointerStripWidth: 2,
          //   pointerLabelComponent: (items) => {
          //     if (!items || items.length === 0 || !items[0]) return null;
          //     const item = items[0];
          //     return (
          //       <View
          //         style={{
          //           height: 35,
          //           width: 100,
          //           backgroundColor: "black",
          //           borderRadius: 4,
          //           padding: 5,
          //           justifyContent: "center",
          //           alignItems: "center",
          //         }}
          //       >
          //         <Text style={{ color: "white", fontSize: 10 }}>
          //           {metric === "Total sales"
          //             ? `$${item.value.toFixed(2)}`
          //             : metric === "Conversion rate"
          //             ? `${item.value.toFixed(2)}%`
          //             : item.value.toFixed(0)}
          //         </Text>
          //       </View>
          //     );
          //   },
          // }}
          curved
          textShiftY={10}
          textShiftX={0}
          showValuesAsDataPointsText={false}
          customDataPoint={({ x, y, item, index, height, width }) => {
            return null;
          }}
          onPress={() => {}}
          enablePanGesture={false}
          disableScroll={Platform.OS === "ios"}
          scrollable={false}
        />

        {/* Time labels container */}
        <View style={styles.timeLabelContainer}>
          {timeLabels.map((label, idx) => (
            <Text key={idx} style={styles.timeLabel}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const openWhatsApp = () => {
    const whatsappUrl = `whatsapp://send?phone=9024987693`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          return Linking.openURL(`https://wa.me/9024987693`);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  // First, add a state for which option to select
  const [selectingOption, setSelectingOption] = useState(false);

  // Then add these state variables in your component
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  // Add this function to handle date selection
  const handleDayPress = (day) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Initialize start date
      const startDate = day.dateString;
      setSelectedStartDate(startDate);
      setSelectedEndDate(null);

      // Mark the selected date
      setMarkedDates({
        [startDate]: {
          selected: true,
          color: "#333", // Changed from #d500f9 to black (#333)
          textColor: "white",
          startingDay: true,
          endingDay: true,
        },
      });
    } else {
      // Set end date if start date is already selected
      const startDate = selectedStartDate;
      const endDate = day.dateString;

      // Ensure proper order (start date should be before end date)
      let start = startDate;
      let end = endDate;

      if (new Date(startDate) > new Date(endDate)) {
        start = endDate;
        end = startDate;
      }

      setSelectedStartDate(start);
      setSelectedEndDate(end);

      // Generate marked dates object for the selected range
      const markedDatesObj = {};
      const startTimestamp = new Date(start).getTime();
      const endTimestamp = new Date(end).getTime();

      for (
        let day = startTimestamp;
        day <= endTimestamp;
        day += 24 * 60 * 60 * 1000
      ) {
        const dateString = new Date(day).toISOString().split("T")[0];

        if (dateString === start) {
          markedDatesObj[dateString] = {
            selected: true,
            color: "#333", // Changed from #d500f9 to black (#333)
            textColor: "white",
            startingDay: true,
          };
        } else if (dateString === end) {
          markedDatesObj[dateString] = {
            selected: true,
            color: "#333", // Changed from #d500f9 to black (#333)
            textColor: "white",
            endingDay: true,
          };
        } else {
          markedDatesObj[dateString] = {
            selected: true,
            color: "#e6e6e6", // Changed from #f5e1fd to light gray
            textColor: "black",
          };
        }
      }

      setMarkedDates(markedDatesObj);
    }
  };

  // Add this function to handle the custom range application
  const applyCustomDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      // Format dates for display
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(selectedEndDate);

      const formattedStartDate = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const formattedEndDate = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Set the custom range text
      const customRangeText = `${formattedStartDate} - ${formattedEndDate}`;

      // Apply the "Custom range" data
      setSelectedDateRange("Custom range");
      setShowCalendar(false);
      setSelectingOption(false);
    }
  };

  if (isActive) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F5F5F5",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
            width: "100%",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#FF6B6B",
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            Payment Pending
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: "#333",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            The developer hasn't paid the fees.
          </Text>

          <View
            style={{
              backgroundColor: "#F0F0F0",
              borderRadius: 10,
              padding: 15,
              marginBottom: 20,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#666",
                textAlign: "center",
              }}
            >
              Contact Number:
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#FF6B6B",
                }}
              >
                {" "}
                {9024987693}
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={openWhatsApp}
            style={{
              backgroundColor: "#25D366",
              borderRadius: 15,
              paddingVertical: 15,
              paddingHorizontal: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                marginLeft: 10,
              }}
            >
              Contact on WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={[styles.container, { backgroundColor: "white" }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="transparent"
              colors={["white"]}
              // progressBackgroundColor="transparent"
              style={{ backgroundColor: "transparent", elevation: 0 }}
              progressViewOffset={-20}
              size="default"
              title=""
            />
          }
          contentContainerStyle={{
            paddingTop: refreshing ? 0 : 0,
          }}
        >
          {/* Custom refresh animation */}
          <Animated.View
            style={[styles.refreshContainer, refreshContainerStyle]}
          >
            <ActivityIndicator size="large" color="#939393" />
          </Animated.View>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {profileData.image ? (
                <Image
                  source={{ uri: profileData.image }}
                  width={34}
                  height={34}
                  style={{ borderRadius: 8 }} // Updated radius
                />
              ) : (
                <View style={styles.logo}>
                  <Text style={styles.logoText}>SB</Text>
                </View>
              )}
            </View>
            <Text style={styles.title}>{profileData.name}</Text>
            <TouchableOpacity
              style={styles.bellIcon}
              onPress={() => {
                loadAndGenerateData().then(() => {
                  // Force re-render by updating a state value
                  setSelectedMetricIndex((prev) => {
                    // Toggle between the current index and itself to force re-render
                    // This trick helps React recognize there's a change
                    setTimeout(() => setSelectedMetricIndex(prev), 50);
                    return prev;
                  });
                });
              }}
            >
              <NotificationIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="gray" />
            <Text style={styles.searchText}>Search</Text>
          </View>

          <View style={styles.dateFilterContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={styles.dateFilter}
                onPress={() => {
                  setSelectingOption(true);
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "500" }}>
                  {selectedDateRange}
                </Text>
                <Ionicons name="chevron-down" size={16} color="black" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.liveView}>
                <View style={styles.dot} />
                <Text style={{ fontSize: 11, fontWeight: "500" }}>
                  {profileData?.noOfActiveUsers != 0
                    ? `${profileData.noOfActiveUsers} visitors`
                    : "Live View"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.reportBtn}>
              <MaterialCommunityIcons
                name="text-box-search-outline"
                size={16}
                color="black"
              />
              <Text style={{ fontSize: 11, fontWeight: "500" }}>Report</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsContainer}>
            {/* Wrap the metrics header in an Animated.View */}
            <Animated.View style={[animatedHeaderStyle]}>
              <View
                style={[
                  styles.metricHeader,
                  {
                    width: screenWidth - 32,
                    marginHorizontal: 16,
                    marginBottom: 10,
                  },
                ]}
              >
                {/* Primary metric */}
                <View>
                  <Text style={styles.metricName}>
                    {metrics[selectedMetricIndex]}
                  </Text>
                  <View style={styles.metricValue}>
                    <Text style={styles.metricNumber}>
                      {getMetricValue(metrics[selectedMetricIndex])}
                    </Text>
                    {renderChangeIndicator(
                      getMetricChange(metrics[selectedMetricIndex]),
                      true
                    )}
                  </View>
                </View>

                {/* Second metric */}
                <View style={{ marginLeft: 50 }}>
                  <Text style={styles.metricLabel}>
                    {metrics[selectedMetricIndex] === "Total sales"
                      ? "Orders"
                      : metrics[selectedMetricIndex] === "Orders"
                      ? "Conversion rate"
                      : metrics[selectedMetricIndex] === "Conversion rate"
                      ? "Sessions"
                      : "Total sales"}
                  </Text>
                  <Text style={styles.sessionValue}>
                    {metrics[selectedMetricIndex] === "Total sales"
                      ? `${dashboardData.orders}`
                      : metrics[selectedMetricIndex] === "Orders"
                      ? `${dashboardData.conversionRate}%`
                      : metrics[selectedMetricIndex] === "Conversion rate"
                      ? `${dashboardData.sessions}`
                      : `$${dashboardData.totalSales}`}
                  </Text>
                  {renderChangeIndicator(
                    metrics[selectedMetricIndex] === "Total sales"
                      ? dashboardData.ordersChange
                      : metrics[selectedMetricIndex] === "Orders"
                      ? dashboardData.conversionRateChange
                      : metrics[selectedMetricIndex] === "Conversion rate"
                      ? dashboardData.sessionsChange
                      : dashboardData.totalSalesChange,
                    false
                  )}
                </View>

                {/* Third metric */}
                <View>
                  <Text style={styles.metricLabel}>
                    {metrics[selectedMetricIndex] === "Total sales"
                      ? "Conversion rate"
                      : metrics[selectedMetricIndex] === "Orders"
                      ? "Sessions"
                      : metrics[selectedMetricIndex] === "Conversion rate"
                      ? "Total sales"
                      : "Orders"}
                  </Text>
                  <Text style={styles.salesValue}>
                    {metrics[selectedMetricIndex] === "Total sales"
                      ? `${dashboardData.conversionRate}%`
                      : metrics[selectedMetricIndex] === "Orders"
                      ? `${dashboardData.sessions}`
                      : metrics[selectedMetricIndex] === "Conversion rate"
                      ? `$${dashboardData.totalSales}`
                      : `${dashboardData.orders}`}
                  </Text>
                  {renderChangeIndicator(
                    metrics[selectedMetricIndex] === "Total sales"
                      ? dashboardData.conversionRateChange
                      : metrics[selectedMetricIndex] === "Orders"
                      ? dashboardData.sessionsChange
                      : metrics[selectedMetricIndex] === "Conversion rate"
                      ? dashboardData.totalSalesChange
                      : dashboardData.ordersChange,
                    false
                  )}
                </View>
              </View>
            </Animated.View>

            {/* Carousel */}
            <View>
              <Carousel
                width={screenWidth}
                height={165}
                data={metrics}
                renderItem={renderMetricItem}
                onSnapToItem={(index) => {
                  // console.log("index", index);
                  animateHeaderTransition(index);
                }}
                loop={true}
                style={{
                  width: screenWidth,
                  marginHorizontal: 16,
                }}
              />
            </View>

            <View style={styles.statsBoxContainer}>
              <View style={styles.statsBox}>
                <View style={styles.statsBoxIcon}>
                  <OrderIcon width={24} height={24} />
                  <Text style={styles.statsNumber}>
                    {dashboardData.ordersFulfill || 0}+
                  </Text>
                </View>
                <Text style={styles.statsLabel}>Orders to fulfill</Text>
              </View>

              <View style={styles.statsBox}>
                <View style={styles.statsBoxIcon}>
                  <SvgComponent />

                  <Text style={styles.statsNumber}>
                    {dashboardData.paymentCapture || 0}
                  </Text>
                </View>
                <Text
                  style={styles.statsLabel}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Payment to capture
                </Text>
              </View>

              <View style={styles.statsBox}>
                <View style={styles.statsBoxIcon}>
                  <AlertTriangleIcon />
                  <Text style={styles.statsNumber}>
                    {dashboardData.highRiskOrders || 0}
                  </Text>
                </View>
                <Text style={styles.statsLabel}>High risk orders</Text>
              </View>

              <View style={styles.statsBox}>
                <View style={styles.statsBoxIcon}>
                  <ClipboardCheckIcon />
                  <Text style={styles.statsNumber}>
                    {dashboardData.chargebacks || 0}
                  </Text>
                </View>
                <Text style={styles.statsLabel}>Chargebacks</Text>
              </View>
            </View>

            <View
              style={[
                styles.emailSection,
                {
                  marginBottom: 15,
                  paddingBottom: 13,
                  borderBottomWidth: 10,
                  borderBottomColor: "#F1F1F1",
                },
              ]}
            >
              <View style={styles.emailHeader}>
                <Text style={styles.emailTitle}>
                  Read your most interested buyers
                </Text>
                <TouchableOpacity>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.emailDescription}>
                  optimise your ads spend and connect with the right customers
                  more efficiently and leverage the power of Audience with
                  Shopify Plus
                </Text>
                {/* <ImageIcon /> */}
                {/* <Image
                  source={require("../../assets/images/image.png")}
                  style={{ width: 140, height: 120, marginHorizontal: 10 }}
                /> */}
              </View>

              <TouchableOpacity style={styles.emailButton}>
                <Text style={styles.emailButtonText}>
                  Upgrade to Shopify Plus
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.learnMore}>Learn more</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.emailSection}>
              <View style={styles.emailHeader}>
                <Text style={styles.emailTitle}>
                  Connect with customers quickly using Shopify Email
                </Text>
                <TouchableOpacity>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.emailDescription}>
                  Create branded emails in minutes with a drag-and-drop editor
                  and templates that showcase products, checkout links, and
                  discounts. Send your first 10,000 emails free every month.
                </Text>
                {/* <ImageIcon /> */}
                {/* <Image
                  source={require("../../assets/images/image.png")}
                  style={{ width: 140, height: 120, marginHorizontal: 10 }}
                /> */}
              </View>

              <TouchableOpacity style={styles.emailButton}>
                <Text style={styles.emailButtonText}>Send an email</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.learnMore}>Learn more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Then add this at the very bottom of your component, outside of ScrollView */}
      {selectingOption && (
        <View style={styles.optionOverlay}>
          <View
            style={[
              styles.optionContainer,
              {
                position: "absolute",
                bottom: 0,
                width: "100%",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                maxHeight: "80%",
              },
            ]}
          >
            {!showCalendar ? (
              <>
                <View style={styles.headerBar}>
                  <Text style={styles.optionTitle}>Date range</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectingOption(false)}
                  >
                    <Ionicons name="close" size={20} color="black" />
                  </TouchableOpacity>
                </View>

                <View style={styles.dateContainer}>
                  <View style={styles.datePickerRow}>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                    <Text style={styles.dateText}>
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => {
                      setSelectingOption(false);
                      setShowCalendar(true);
                    }}
                  >
                    <Text style={styles.customText}>Custom</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.optionScroll}>
                  {Object.keys(rangeDataMap)
                    .filter((range) => range !== "Custom range") // Filter out Custom range from the list
                    .map((range, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.optionItem}
                        onPress={() => {
                          setSelectedDateRange(range);
                          setSelectingOption(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selectedDateRange === range &&
                              styles.selectedOptionText,
                          ]}
                        >
                          {range}
                        </Text>
                        {selectedDateRange === range && (
                          <Ionicons
                            name="checkmark"
                            size={24}
                            // color="#d500f9"
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.calendarHeader,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <Text style={styles.calendarTitle}>Custom date range</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowCalendar(false)}
                  >
                    <Ionicons name="close" size={20} color="black" />
                  </TouchableOpacity>
                </View>

                <View style={styles.dateInputContainer}>
                  <View style={styles.dateInputWrapper}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#666"
                      style={styles.dateInputIcon}
                    />
                    <Text style={styles.dateInputLabel}>
                      {selectedStartDate
                        ? new Date(selectedStartDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Start date"}
                    </Text>
                  </View>
                  <Text style={styles.dateArrow}>→</Text>
                  <View style={styles.dateInputWrapper}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#666"
                      style={styles.dateInputIcon}
                    />
                    <Text style={styles.dateInputLabel}>
                      {selectedEndDate
                        ? new Date(selectedEndDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "End date"}
                    </Text>
                  </View>
                </View>

                <Calendar
                  markingType={"period"}
                  markedDates={markedDates}
                  onDayPress={handleDayPress}
                  hideExtraDays={false}
                  maxDate={new Date().toISOString().split("T")[0]}
                  disableAllTouchEventsForDisabledDays={true}
                  theme={{
                    backgroundColor: "white",
                    calendarBackground: "white",
                    textSectionTitleColor: "#b6c1cd",
                    selectedDayBackgroundColor: "#333",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#333",
                    dayTextColor: "#2d4150",
                    textDisabledColor: "#d9e1e8",
                    dotColor: "#333",
                    selectedDotColor: "#ffffff",
                    arrowColor: "#333",
                    monthTextColor: "#2d4150",
                    indicatorColor: "#333",
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14,
                    "stylesheet.calendar.header": {
                      header: {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 10,
                        marginBottom: 10,
                      },
                    },
                  }}
                  renderHeader={(date) => {
                    const dateObj = new Date(date);
                    const monthName = dateObj.toLocaleString("default", {
                      month: "long",
                    });
                    const year = dateObj.getFullYear();
                    return (
                      <Text style={styles.monthTitle}>
                        {monthName} {year}
                      </Text>
                    );
                  }}
                />

                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    !(selectedStartDate && selectedEndDate) &&
                      styles.disabledButton,
                  ]}
                  onPress={applyCustomDateRange}
                  disabled={!(selectedStartDate && selectedEndDate)}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}

      {showCalendar && (
        <View style={styles.optionOverlay}>
          <View style={styles.calendarContainer}>
            <View
              style={[
                styles.calendarHeader,
                { justifyContent: "space-between" },
              ]}
            >
              <Text style={styles.calendarTitle}>Custom date range</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowCalendar(false);
                  setSelectingOption(false);
                }}
              >
                <Ionicons name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <View style={styles.dateInputWrapper}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#666"
                  style={styles.dateInputIcon}
                />
                <Text style={styles.dateInputLabel}>
                  {selectedStartDate
                    ? new Date(selectedStartDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Start date"}
                </Text>
              </View>
              <Text style={styles.dateArrow}>→</Text>
              <View style={styles.dateInputWrapper}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#666"
                  style={styles.dateInputIcon}
                />
                <Text style={styles.dateInputLabel}>
                  {selectedEndDate
                    ? new Date(selectedEndDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "End date"}
                </Text>
              </View>
            </View>

            <Calendar
              markingType={"period"}
              markedDates={markedDates}
              onDayPress={handleDayPress}
              hideExtraDays={false}
              maxDate={new Date().toISOString().split("T")[0]}
              disableAllTouchEventsForDisabledDays={true}
              theme={{
                backgroundColor: "white",
                calendarBackground: "white",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#333",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#333",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
                dotColor: "#333",
                selectedDotColor: "#ffffff",
                arrowColor: "#333",
                monthTextColor: "#2d4150",
                indicatorColor: "#333",
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
                "stylesheet.calendar.header": {
                  header: {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 10,
                    marginBottom: 10,
                  },
                },
              }}
              renderHeader={(date) => {
                const dateObj = new Date(date);
                const monthName = dateObj.toLocaleString("default", {
                  month: "long",
                });
                const year = dateObj.getFullYear();
                return (
                  <Text style={styles.monthTitle}>
                    {monthName} {year}
                  </Text>
                );
              }}
            />

            <TouchableOpacity
              style={[
                styles.applyButton,
                !(selectedStartDate && selectedEndDate) &&
                  styles.disabledButton,
              ]}
              onPress={applyCustomDateRange}
              disabled={!(selectedStartDate && selectedEndDate)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#d500f9",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  bellIcon: {
    padding: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchText: {
    marginLeft: 8,
    color: "gray",
  },
  dateFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateFilter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  liveView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#33E88C",
    marginRight: 6,
  },
  reportBtn: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricsContainer: {
    // paddingHorizontal: 16,
    flex: 1,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricName: {
    fontSize: 14,
    // color: "gray",
  },
  metricValue: {
    // flexDirection: "row",
    alignItems: "baseline",
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: "800",
    marginRight: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: "800",
    paddingRight: 5,
  },
  positiveChange: {
    color: "#288A5B",
  },
  negativeChange: {
    color: "#A7A7A7",
  },
  metricLabel: {
    fontSize: 12,
    color: "gray",
  },
  sessionValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "gray",
  },
  sessionChange: {
    color: "red",
    fontSize: 12,
  },
  salesValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "gray",
  },
  salesChange: {
    color: "green",
    fontSize: 12,
  },
  chartContainer: {
    // marginVertical: 16,
  },
  chart: {
    marginLeft: -14,
  },
  statsBoxIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statsBoxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "space-between",
    marginBottom: 16,
    // marginTop: 16,
    paddingTop: 12,
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 16,
  },
  statsBox: {
    width: "32%",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E3E3E3",
  },
  statsNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3F3F3F",
    marginLeft: -8,
  },
  statsLabel: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
  },
  emailSection: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    borderRadius: 8,
    // marginBottom: 16,
  },
  emailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  emailTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  emailDescription: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
  emailButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  emailButtonText: {
    fontWeight: "500",
  },
  learnMore: {
    color: "#0066ff",
    textAlign: "center",
    fontSize: 13,
  },
  addOrderButton: {
    backgroundColor: "#d500f9",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  addOrderButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalOptionText: {
    fontSize: 16,
  },
  selectedOption: {
    color: "#d500f9",
    fontWeight: "bold",
  },
  closeModalButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
    alignItems: "center",
  },
  closeModalButtonText: {
    fontSize: 16,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#d500f9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
  metricsScrollView: {
    marginTop: 10,
    marginHorizontal: 16,
  },
  metricPage: {
    paddingRight: 16,
  },
  metricPills: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metricPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    marginRight: 8,
  },
  selectedMetricPill: {
    backgroundColor: "#d500f9",
  },
  metricPillText: {
    fontSize: 12,
    color: "#555",
  },
  selectedMetricPillText: {
    color: "white",
    fontWeight: "600",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#d500f9",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  customDropdown: {
    position: "absolute",
    top: 110, // Adjust based on your layout
    left: 16,
    zIndex: 999,
    backgroundColor: "white",
    width: 180,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingVertical: 8,
  },
  customDropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedDropdownOption: {
    backgroundColor: "#f8f8f8",
  },
  customDropdownText: {
    fontSize: 14,
  },
  selectedDropdownText: {
    color: "#d500f9",
    fontWeight: "bold",
  },
  optionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center", // Changed to center for the calendar
    alignItems: "center",
    zIndex: 1000,
  },
  optionContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    maxHeight: "80%",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  optionScroll: {
    maxHeight: 300,
  },
  optionItem: {
    paddingVertical: 15,
    // borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    // color: '#d500f9',
    fontWeight: "500",
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "500",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  closeButton: {
    padding: 4,
    backgroundColor: "#dbdbdb",
    borderRadius: 50,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    marginHorizontal: -20, // This extends beyond the container padding
    paddingHorizontal: 20, // Add padding to match the container
    borderBottomWidth: 10, // Reduced from 10 to a more standard 1px
    borderBottomColor: "#eee",
    marginBottom: 15, // Add some space after the border
  },
  datePickerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 15,
    marginLeft: 10,
  },
  customButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  customText: {
    color: "#0066ff",
    fontWeight: "500",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  calendarHeaderText: {
    fontSize: 16,
    fontWeight: "500",
  },
  applyButton: {
    marginTop: 15,
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
  },
  calendarContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  dateInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dateInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  dateInputIcon: {
    marginRight: 8,
  },
  dateInputLabel: {
    color: "#666",
    fontSize: 15,
  },
  dateArrow: {
    fontSize: 18,
    marginHorizontal: 10,
    color: "#666",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  timeLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: -10,
    marginRight: 60,
  },
  timeLabel: {
    fontSize: 9,
    color: "#848485",
    fontWeight: "400",
    width: 45,
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    color: "#12ABF0",
    fontSize: 14,
    fontWeight: "500",
  },
  refreshContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    overflow: "hidden",
  },
  refreshText: {
    color: "#12ABF0",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
  },
});
