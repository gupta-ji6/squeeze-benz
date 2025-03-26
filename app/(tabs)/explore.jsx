import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ExploreScreen() {
  const [showDataForm, setShowDataForm] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Today");

  // Available date ranges
  const dateRanges = [
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "Last 365 days",
    "Last month",
    "Last 12 Months",
    "Custom range",
  ];

  // Form state for range metrics
  const [rangeData, setRangeData] = useState({
    totalSales: "",
    totalSalesChange: "",
    orders: "",
    ordersChange: "",
    conversionRate: "",
    conversionRateChange: "",
    sessions: "",
    sessionsChange: "",
    ordersFulfill: "",
    paymentCapture: "",
    highRiskOrders: "",
    chargebacks: "",
  });

  // Default data for ranges with percentage changes
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

  // State to hold all saved range data
  const [allRangeData, setAllRangeData] = useState(defaultRangeData);

  useEffect(() => {
    loadRangeData();
  }, []);

  const loadRangeData = async () => {
    try {
      const savedRangeData = await AsyncStorage.getItem("dashboardRangeData");
      if (savedRangeData) {
        const data = JSON.parse(savedRangeData);
        setAllRangeData(data);
      } else {
        // Initialize with default data if nothing is saved
        await AsyncStorage.setItem(
          "dashboardRangeData",
          JSON.stringify(defaultRangeData)
        );
        setAllRangeData(defaultRangeData);
      }
    } catch (error) {
      console.error("Failed to load dashboard range data:", error);
    }
  };

  const handleEditRange = (range) => {
    setSelectedRange(range);
    
    // Create a safe copy of the data, ensuring all values are strings to prevent toString errors
    const safeData = { ...allRangeData[range] };
    Object.keys(safeData).forEach(key => {
      // Convert all values to strings, handling null/undefined
      safeData[key] = safeData[key] !== null && safeData[key] !== undefined 
        ? safeData[key].toString() 
        : '';
    });
    
    setRangeData(safeData);
    setShowDataForm(true);
  };

  const handleSaveData = async () => {
    try {
      // Convert string values back to appropriate types
      const processedData = { ...rangeData };
      
      // Convert numeric fields to numbers
      const numericFields = [
        'totalSales', 'totalSalesChange', 
        'orders', 'ordersChange', 
        'conversionRate', 'conversionRateChange',
        'sessions', 'sessionsChange',
        'ordersFulfill', 'paymentCapture', 
        'highRiskOrders', 'chargebacks'
      ];
      
      numericFields.forEach(field => {
        if (processedData[field] !== '' && processedData[field] !== undefined) {
          processedData[field] = Number(processedData[field]);
        } else {
          // Default values for empty fields
          processedData[field] = field.includes('Change') ? 0 : 0;
        }
      });

      // Create updated object
      const updatedAllRangeData = {
        ...allRangeData,
        [selectedRange]: processedData,
      };

      // Save to storage
      await AsyncStorage.setItem(
        "dashboardRangeData",
        JSON.stringify(updatedAllRangeData)
      );

      // Update state
      setAllRangeData(updatedAllRangeData);
      setShowDataForm(false);
      alert(`Data for ${selectedRange} updated successfully!`);
    } catch (error) {
      console.error("Failed to save dashboard data:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  const resetToDefault = async (range) => {
    try {
      if (
        confirm(
          `Are you sure you want to reset data for "${range}" to default?`
        )
      ) {
        // Update only the specific range to default
        const updatedAllRangeData = {
          ...allRangeData,
          [range]: defaultRangeData[range],
        };

        // Save to storage
        await AsyncStorage.setItem(
          "dashboardRangeData",
          JSON.stringify(updatedAllRangeData)
        );

        // Update state
        setAllRangeData(updatedAllRangeData);
        alert(`Data for ${range} has been reset to default values.`);
      }
    } catch (error) {
      console.error("Failed to reset data:", error);
      alert("Failed to reset data. Please try again.");
    }
  };

  const renderChangeIndicator = (value) => {
    // Ensure value is a number and handle null/undefined cases
    const numValue = Number(value);
    const isPositive = !isNaN(numValue) && numValue >= 0;
    
    // Only display if we have a valid number
    if (isNaN(numValue)) {
      return <Text style={styles.changeIndicator}>0%</Text>;
    }
    
    return (
      <Text
        style={[
          styles.changeIndicator,
          isPositive ? styles.positiveChange : styles.negativeChange,
        ]}
      >
        {isPositive ? "↗" : "↘"} {Math.abs(numValue)}%
      </Text>
    );
  };

  const renderRangeItem = ({ item }) => {
    // Ensure we have valid data for this item
    const itemData = allRangeData[item] || defaultRangeData[item];
    
    return (
      <View style={styles.rangeItem}>
        <View style={styles.rangeHeader}>
          <Text style={styles.rangeTitle}>{item}</Text>
          <View style={styles.rangeActions}>
            <TouchableOpacity
              onPress={() => handleEditRange(item)}
              style={styles.actionButton}
            >
              <Ionicons name="create-outline" size={20} color="#2196f3" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => resetToDefault(item)}
              style={styles.actionButton}
            >
              <Ionicons name="refresh-outline" size={20} color="#ff9800" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rangeStats}>
          <View style={styles.metricsSection}>
            <View style={styles.metricItem}>
              <Text style={styles.metricName}>Total sales</Text>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>
                  ${Number(itemData.totalSales || 0).toFixed(2)}
                </Text>
                {renderChangeIndicator(itemData.totalSalesChange)}
              </View>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricName}>Orders</Text>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>
                  {itemData.orders || 0}
                </Text>
                {renderChangeIndicator(itemData.ordersChange)}
              </View>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricName}>Conversion rate</Text>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>
                  {itemData.conversionRate || 0}%
                </Text>
                {renderChangeIndicator(itemData.conversionRateChange)}
              </View>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricName}>Sessions</Text>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>
                  {itemData.sessions || 0}
                </Text>
                {renderChangeIndicator(itemData.sessionsChange)}
              </View>
            </View>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {itemData.ordersFulfill || 0}+
              </Text>
              <Text style={styles.statLabel}>Orders to fulfill</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {itemData.paymentCapture || 0}
              </Text>
              <Text style={styles.statLabel}>Payment to capture</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {itemData.highRiskOrders || 0}
              </Text>
              <Text style={styles.statLabel}>High risk orders</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {itemData.chargebacks || 0}
              </Text>
              <Text style={styles.statLabel}>Chargebacks</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard Data Manager</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Date Range Management</Text>
          <Text style={styles.description}>
            Edit the metrics for each date range to customize your dashboard
            data. These values will appear when you select different date ranges
            on the home screen.
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#0066ff"
              />
              <Text style={styles.infoText}>
                Tap the edit button to modify metrics and percentage changes for
                any date range.
              </Text>
            </View>
          </View>

          <View style={styles.rangesContainer}>
            <FlatList
              data={dateRanges}
              renderItem={renderRangeItem}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </ScrollView>

      {/* Edit Form Modal */}
      <Modal visible={showDataForm} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit Data for "{selectedRange}"
              </Text>
              <TouchableOpacity onPress={() => setShowDataForm(false)}>
                <Ionicons name="close-outline" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScrollView}>
              <Text style={styles.formSectionTitle}>Key Metrics</Text>

              <View style={styles.inputSection}>
                <Text style={styles.inputGroupTitle}>Total Sales</Text>
                <View style={styles.rowInputs}>
                  <View style={styles.mainInput}>
                    <Text style={styles.inputLabel}>Value ($)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rangeData.totalSales ? rangeData.totalSales.toString() : '0'}
                      onChangeText={(text) =>
                        setRangeData({ ...rangeData, totalSales: text })
                      }
                      keyboardType="numeric"
                      placeholder="250.51"
                    />
                  </View>
                  <View style={styles.changeInput}>
                    <Text style={styles.inputLabel}>Change (%)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rangeData.totalSalesChange ? rangeData.totalSalesChange.toString() : '0'}
                      onChangeText={(text) =>
                        setRangeData({ ...rangeData, totalSalesChange: text })
                      }
                      keyboardType="numeric"
                      placeholder="146"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputGroupTitle}>Orders</Text>
                <View style={styles.rowInputs}>
                  <View style={styles.mainInput}>
                    <Text style={styles.inputLabel}>Value</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rangeData.orders ? rangeData.orders.toString() : '0'}
                      onChangeText={(text) =>
                        setRangeData({ ...rangeData, orders: text })
                      }
                      keyboardType="numeric"
                      placeholder="50"
                    />
                  </View>
                  <View style={styles.changeInput}>
                    <Text style={styles.inputLabel}>Change (%)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rangeData.ordersChange ? rangeData.ordersChange.toString() : '0'}
                      onChangeText={(text) =>
                        setRangeData({ ...rangeData, ordersChange: text })
                      }
                      keyboardType="numeric"
                      placeholder="52"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputGroupTitle}>Conversion Rate</Text>
                <View style={styles.rowInputs}>
                  <View style={styles.mainInput}>
                    <Text style={styles.inputLabel}>Value (%)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rangeData.conversionRate ? rangeData.conversionRate.toString() : '0'}
                      onChangeText={(text) =>
                        setRangeData({ ...rangeData, conversionRate: text })
                      }
                      keyboardType="numeric"
                      placeholder="1.01"
                    />
                  </View>
                  <View style={styles.changeInput}>
                    <Text style={styles.inputLabel}>Change (%)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rangeData.conversionRateChange ? rangeData.conversionRateChange.toString() : '0'}
                      onChangeText={(text) =>
                        setRangeData({ ...rangeData, conversionRateChange: text })
                      }
                      keyboardType="numeric"
                      placeholder="80"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputGroupTitle}>Sessions</Text>
                <View style={styles.rowInputs}>
                  <View style={styles.mainInput}>
                    <Text style={styles.inputLabel}>Value</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rangeData.sessions ? rangeData.sessions.toString() : '0'}
                      onChangeText={(text) =>
                        setRangeData({ ...rangeData, sessions: text })
                      }
                      keyboardType="numeric"
                      placeholder="296"
                    />
                  </View>
                  <View style={styles.changeInput}>
                    <Text style={styles.inputLabel}>Change (%)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={rangeData.sessionsChange ? rangeData.sessionsChange.toString() : '0'}
                      onChangeText={(text) =>
                        setRangeData({ ...rangeData, sessionsChange: text })
                      }
                      keyboardType="numeric"
                      placeholder="-17"
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.formSectionTitle}>Dashboard Stats</Text>

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Orders to Fulfill</Text>
                  <TextInput
                    style={styles.textInput}
                    value={rangeData.ordersFulfill ? rangeData.ordersFulfill.toString() : '0'}
                    onChangeText={(text) =>
                      setRangeData({ ...rangeData, ordersFulfill: text })
                    }
                    keyboardType="numeric"
                    placeholder="50"
                  />
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Payment to Capture</Text>
                  <TextInput
                    style={styles.textInput}
                    value={rangeData.paymentCapture ? rangeData.paymentCapture.toString() : '0'}
                    onChangeText={(text) =>
                      setRangeData({ ...rangeData, paymentCapture: text })
                    }
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>High Risk Orders</Text>
                  <TextInput
                    style={styles.textInput}
                    value={rangeData.highRiskOrders ? rangeData.highRiskOrders.toString() : '0'}
                    onChangeText={(text) =>
                      setRangeData({ ...rangeData, highRiskOrders: text })
                    }
                    keyboardType="numeric"
                    placeholder="3"
                  />
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Chargebacks</Text>
                  <TextInput
                    style={styles.textInput}
                    value={rangeData.chargebacks ? rangeData.chargebacks.toString() : '0'}
                    onChangeText={(text) =>
                      setRangeData({ ...rangeData, chargebacks: text })
                    }
                    keyboardType="numeric"
                    placeholder="7"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDataForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveData}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  infoContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  rangesContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  rangeItem: {
    marginBottom: 8,
    paddingBottom: 16,
  },
  rangeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rangeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  rangeActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  rangeStats: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#d500f9",
  },
  metricsSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 12,
    marginBottom: 12,
  },
  metricItem: {
    marginBottom: 8,
  },
  metricName: {
    fontSize: 12,
    color: "#666",
  },
  metricValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 6,
  },
  changeIndicator: {
    fontSize: 12,
    fontWeight: "500",
  },
  positiveChange: {
    color: "#4caf50",
  },
  negativeChange: {
    color: "#f44336",
  },
  statsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "48%",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    maxHeight: "90%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  formScrollView: {
    padding: 16,
    maxHeight: 500,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#d500f9",
  },
  inputGroupTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mainInput: {
    width: "65%",
  },
  changeInput: {
    width: "30%",
  },
  halfInput: {
    width: "48%",
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
    color: "#666",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fafafa",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#555",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#d500f9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
