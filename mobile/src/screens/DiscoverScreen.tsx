import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { searchProperties, listColleges } from "../api/client";
import { Colors, FontSize, Spacing, BorderRadius } from "../theme/colors";
import type { PropertyCard } from "../types";

const PROPERTY_TYPES = [
  { key: "all", label: "All", icon: "grid" },
  { key: "pg", label: "PG", icon: "home" },
  { key: "hostel", label: "Hostel", icon: "bed" },
  { key: "single_room", label: "Room", icon: "cube" },
  { key: "flat", label: "Flat", icon: "business" },
  { key: "co_living", label: "Co-live", icon: "people" },
] as const;

export function DiscoverScreen({ navigation }: any) {
  const [selectedType, setSelectedType] = useState("all");
  const [collegeId] = useState("sample-college-1");

  const collegesQuery = useQuery({
    queryKey: ["colleges"],
    queryFn: listColleges,
  });

  const propertiesQuery = useQuery({
    queryKey: ["properties", collegeId, selectedType],
    queryFn: () =>
      searchProperties({
        college_id: collegeId,
        radius_km: 5,
        property_type: selectedType === "all" ? undefined : selectedType,
        page: 1,
        limit: 20,
      }),
  });

  const college = collegesQuery.data?.find((c) => c.college_id === collegeId);

  const renderCard = ({ item }: { item: PropertyCard }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("PropertyDetail", { propertyId: item.property_id })}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {item.cover_image_url ? (
          <Image source={{ uri: item.cover_image_url }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={32} color={Colors.outline} />
          </View>
        )}
        {/* Type badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {item.property_type.replace("_", " ").toUpperCase()}
          </Text>
        </View>
        {/* Featured badge */}
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#FFF" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.outline} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.address_text || "Near campus"}
          </Text>
          {item.distance_km != null && (
            <Text style={styles.distanceText}>{item.distance_km} km</Text>
          )}
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{item.rent_min.toLocaleString()}
            {item.rent_min !== item.rent_max && ` – ₹${item.rent_max.toLocaleString()}`}
          </Text>
          <Text style={styles.priceLabel}>/month</Text>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesRow}>
          {item.amenities.slice(0, 4).map((a) => (
            <View key={a} style={styles.amenityChip}>
              <Text style={styles.amenityText}>{a}</Text>
            </View>
          ))}
          {item.amenities.length > 4 && (
            <Text style={styles.moreAmenities}>+{item.amenities.length - 4}</Text>
          )}
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={Colors.primary} />
          <Text style={styles.ratingText}>{item.rating_avg.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({item.review_count} reviews)</Text>
          {item.gender && item.gender !== "any" && (
            <View style={styles.genderBadge}>
              <Ionicons
                name={item.gender === "male" ? "male" : "female"}
                size={12}
                color={item.gender === "male" ? "#3B82F6" : "#EC4899"}
              />
              <Text style={[styles.genderText, { color: item.gender === "male" ? "#3B82F6" : "#EC4899" }]}>
                {item.gender === "male" ? "Male" : "Female"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Searching near</Text>
          <Text style={styles.collegeName}>
            {college?.name || "Loading..."}
          </Text>
        </View>
        <View style={styles.resultCount}>
          <Text style={styles.resultText}>
            {propertiesQuery.data?.total ?? 0} found
          </Text>
        </View>
      </View>

      {/* Filter pills */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={PROPERTY_TYPES}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterPill,
              selectedType === item.key && styles.filterPillActive,
            ]}
            onPress={() => setSelectedType(item.key)}
          >
            <Ionicons
              name={item.icon as any}
              size={16}
              color={selectedType === item.key ? "#FFF" : Colors.outline}
            />
            <Text
              style={[
                styles.filterLabel,
                selectedType === item.key && styles.filterLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Listings */}
      {propertiesQuery.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding properties...</Text>
        </View>
      ) : (
        <FlatList
          data={propertiesQuery.data?.items ?? []}
          keyExtractor={(item) => item.property_id}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={propertiesQuery.isRefetching}
              onRefresh={() => propertiesQuery.refetch()}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={Colors.outline} />
              <Text style={styles.emptyTitle}>No properties found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters or search area
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLabel: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.outline,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  collegeName: {
    fontSize: FontSize.lg,
    fontWeight: "900",
    color: Colors.onSurface,
    marginTop: 2,
  },
  resultCount: {
    backgroundColor: Colors.primaryFixed,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  resultText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.primaryDark,
  },
  filterList: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainer,
    marginRight: Spacing.sm,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
  },
  filterLabelActive: { color: "#FFF" },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  loadingText: { color: Colors.outline, fontSize: FontSize.sm },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  imageContainer: { position: "relative" },
  cardImage: { width: "100%", height: 180, backgroundColor: Colors.surfaceContainer },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  typeBadge: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  typeBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  featuredBadge: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  featuredText: { color: "#FFF", fontSize: 10, fontWeight: "700" },
  cardBody: { padding: Spacing.lg },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: "800",
    color: Colors.onSurface,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: Spacing.md,
  },
  locationText: { fontSize: FontSize.sm, color: Colors.outline, flex: 1 },
  distanceText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.primary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing.md,
  },
  price: {
    fontSize: FontSize.xl,
    fontWeight: "900",
    color: Colors.primaryDark,
  },
  priceLabel: {
    fontSize: FontSize.sm,
    color: Colors.outline,
    marginLeft: 4,
  },
  amenitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: Spacing.md,
  },
  amenityChip: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  amenityText: {
    fontSize: FontSize.xs,
    color: Colors.onSurfaceVariant,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  moreAmenities: {
    fontSize: FontSize.xs,
    color: Colors.outline,
    alignSelf: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  reviewCount: { fontSize: FontSize.xs, color: Colors.outline },
  genderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginLeft: "auto",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainer,
  },
  genderText: { fontSize: FontSize.xs, fontWeight: "600" },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.onSurface,
  },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.outline },
});
