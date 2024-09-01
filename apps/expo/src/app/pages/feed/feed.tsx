import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import { RootStackParamList } from "../../index";
import styles from "./style.jsx";

type FeedProps = {
  navigation: NavigationProp<RootStackParamList, "Feed">;
  route: RouteProp<RootStackParamList, "Feed">;
};

const Feed = ({ navigation, route }: FeedProps) => {
  const userName = route.params?.userName || "Mock";

  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word[0] + word[1]!)
      .join("")
      .toUpperCase();
    return initials;
  };

  const userInitials = getInitials(userName);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{userInitials}</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Olá, {userName}</Text>
            <Text style={styles.subtitle}>Bem-vindo de novo!</Text>
          </View>
        </View>
        <Icon name="notifications-outline" size={30} color="#444" />
      </View>

      {/* Seções */}
      <View style={styles.sections}>
        <View style={styles.highlightedPaymentSection}>
          <Text style={styles.highlightedSectionTitle}>
            Pagamentos Pendentes
          </Text>
          <Text style={styles.highlightedSectionValue}>R$ 537,50</Text>
        </View>

        <View style={styles.paymentSection}>
          <View style={styles.paymentInfoContainer}>
            <View>
              <Text style={styles.sectionTitle}>Aniversário de Caíque</Text>
              <Text style={styles.sectionValue}>R$ 37,50</Text>
            </View>
            <View style={styles.paymentStatusContainer}>
              <Text style={styles.sectionStatus}>Aberto</Text>
              <Text style={styles.sectionDueDate}>Até 27/02</Text>
              <Icon
                name="chevron-forward"
                size={20}
                color="#444"
                style={styles.arrowIcon}
              />
            </View>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <View style={styles.paymentInfoContainer}>
            <View>
              <Text style={styles.sectionTitle}>Contas de casa</Text>
              <Text style={styles.sectionValue}>R$ 500,00</Text>
            </View>
            <View style={styles.paymentStatusContainer}>
              <Text style={styles.sectionStatus}>Aberto</Text>
              <Text style={styles.sectionDueDate}>Até 27/02</Text>
              <Icon
                name="chevron-forward"
                size={20}
                color="#444"
                style={styles.arrowIcon}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.separator} />
      <View style={styles.footer}>
        <TouchableOpacity>
          <Icon name="home" size={30} color="#444" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="add-circle" size={40} color="#444" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="person" size={30} color="#444" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Feed;
