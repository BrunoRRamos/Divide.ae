import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: "#fff",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerTextContainer: {
      marginLeft: 10,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    initialsCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#9995",
      justifyContent: "center",
      alignItems: "center",
    },
    initialsText: {
      color: "#222", 
      fontSize: 18,
    },
    subtitle: {
      fontSize: 14,
      color: "#888",
    },
    sections: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    highlightedPaymentSection: {
      padding: 16,
      marginBottom: 16,
    },
    highlightedSectionTitle: {
      fontSize: 18,
    },
    highlightedSectionValue: {
      fontSize: 20,
      fontWeight: "bold",
    },
    paymentSection: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 30,
      marginBottom: 20,
    },
    paymentInfoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 20,
      color: "#444",
      marginTop: -40,
      marginLeft: -20,
    },
    sectionValue: {
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: -20,
    },
    paymentStatusContainer: {
      alignItems: "flex-end",
    },
    sectionStatus: {
      fontSize: 16,
      color: "green",
      marginTop: -20,
    },
    sectionDueDate: {
      fontSize: 14,
      fontWeight: "bold",
    },
    arrowIcon: {
      marginTop: 8, 
    },
    separator: {
      height: 1,
      backgroundColor: "#ccc",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      padding: 16,
      backgroundColor: "#fff",
    },
  });

export default styles;
