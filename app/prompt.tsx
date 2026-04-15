import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
  Platform,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePrompt } from '@/hooks/usePrompt';
import { useShareCard } from '@/hooks/useShareCard';
import { HText } from '@/components/ui/HText';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ShareCard, CARD_WIDTH, CARD_HEIGHT } from '@/components/ShareCard';
import {
  Colors, Spacing, Radii, Typography,
  getPromptTheme, getPromptGradient,
} from '@/constants/theme';
import { t } from '@/i18n';

// Optional haptics
let Haptics: typeof import('expo-haptics') | null = null;
try { Haptics = require('expo-haptics'); } catch {}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Card preview scale so it fills the share sheet width
const PREVIEW_SCALE = (SCREEN_WIDTH - Spacing.xl * 2) / CARD_WIDTH;
const PREVIEW_W = CARD_WIDTH * PREVIEW_SCALE;
const PREVIEW_H = CARD_HEIGHT * PREVIEW_SCALE;
// Translate to pin scaled card to top-left (RN scales around center by default)
const PREVIEW_TX = -(CARD_WIDTH * (1 - PREVIEW_SCALE)) / 2;
const PREVIEW_TY = -(CARD_HEIGHT * (1 - PREVIEW_SCALE)) / 2;

export default function PromptScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { prompt, hasPrayed, onOpen, onPrayed, nextPrompt } = usePrompt(params.id);
  const { cardRef, shareAsImage } = useShareCard();

  // ── Animations ────────────────────────────────────────────────────────
  const contentOpacity    = useRef(new Animated.Value(0)).current;
  const reflectionOpacity = useRef(new Animated.Value(0)).current;
  const amenScale         = useRef(new Animated.Value(1)).current;
  const amenGlow          = useRef(new Animated.Value(0)).current;  // 0→1 on completion
  const doneOpacity       = useRef(new Animated.Value(0)).current;  // fades in after Amen

  const [reflectionVisible, setReflectionVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [sharing, setSharing] = useState(false);
  // showDone: controls when the Done state is shown — delayed after animations settle
  const [showDone, setShowDone] = useState(false);

  // Fade in on mount
  useEffect(() => {
    onOpen();
    Animated.timing(contentOpacity, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();
  }, []);

  // Reveal reflection after 1.8s (simulates settling into the prayer)
  useEffect(() => {
    setReflectionVisible(false);
    reflectionOpacity.setValue(0);
    const timer = setTimeout(() => {
      setReflectionVisible(true);
      Animated.timing(reflectionOpacity, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }).start();
    }, 1800);
    return () => clearTimeout(timer);
  }, [prompt?.id]);

  // ── Handlers ──────────────────────────────────────────────────────────

  async function handleAmen() {
    if (hasPrayed) return;

    // Haptic — success pattern
    try {
      await Haptics?.notificationAsync(
        (Haptics?.NotificationFeedbackType?.Success as any) ?? ('success' as any),
      );
    } catch {}

    // Scale bounce
    Animated.sequence([
      Animated.timing(amenScale, { toValue: 0.93, duration: 90, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      Animated.spring(amenScale, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 300 }),
    ]).start();

    // Glow / completion transition, then reveal Done state
    Animated.timing(amenGlow, {
      toValue: 1, duration: 500, useNativeDriver: false,
    }).start(() => {
      setShowDone(true);
      Animated.timing(doneOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    });

    onPrayed(); // record stats immediately
  }

  async function handleAnother() {
    try { await Haptics?.selectionAsync(); } catch {}
    Animated.timing(contentOpacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      nextPrompt();
      amenGlow.setValue(0);
      amenScale.setValue(1);
      doneOpacity.setValue(0);
      setShowDone(false);
      Animated.timing(contentOpacity, { toValue: 1, duration: 280, useNativeDriver: true }).start();
    });
  }

  function handleClose() { router.back(); }

  async function handleShare() {
    try { await Haptics?.selectionAsync(); } catch {}
    setShareVisible(true);
  }

  async function handleShareImage() {
    if (!prompt) return;
    setSharing(true);
    try { await Haptics?.selectionAsync(); } catch {}
    await shareAsImage(prompt);
    setSharing(false);
  }

  // ── Empty state ───────────────────────────────────────────────────────

  if (!prompt) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.primaryDeep }]}>
        <LinearGradient colors={[Colors.primaryDeep, Colors.primary]} style={StyleSheet.absoluteFill} />
        <View style={styles.emptyState}>
          <HText variant="body" serif={false} color="rgba(250,247,242,0.5)">
            No prompt available.
          </HText>
          <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <HText variant="bodySm" serif={false} color="rgba(250,247,242,0.35)">
              {t('common.close')}
            </HText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const theme    = getPromptTheme(prompt.id);
  const gradient = getPromptGradient(theme.id);

  const duration = prompt.suggestedDuration
    ? prompt.suggestedDuration < 60
      ? t('prompt.duration_label_seconds', { seconds: prompt.suggestedDuration })
      : t('prompt.duration_label', { minutes: Math.round(prompt.suggestedDuration / 60) })
    : null;

  // Amen button background interpolation: theme.textInverse → subtle gold tint
  const amenBg = amenGlow.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(250,247,242,1)', 'rgba(250,247,242,0.15)'],
  });
  const amenBorderWidth = amenGlow.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>

      {/* ── Background gradient ──────────────────────────────── */}
      <LinearGradient
        colors={gradient as [string, string]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.2, y: 1 }}
      />

      {/* ── Hidden share card (off-screen for capture) ──────── */}
      <View style={styles.offScreen}>
        <ShareCard ref={cardRef} prompt={prompt} mode="prayer" />
      </View>

      {/* ── Top chrome ──────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.topLeft}>
          <CategoryBadge category={prompt.category} size="sm" inverted />
          {duration && (
            <HText variant="micro" serif={false} color={theme.textSoft}>{duration}</HText>
          )}
        </View>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.6}
        >
          <HText variant="body" serif={false} color={theme.textSoft}>✕</HText>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable content ──────────────────────────────── */}
      <Animated.ScrollView
        style={[styles.scroll, { opacity: contentOpacity }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 180 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.rule, { backgroundColor: theme.rule }]} />

        <HText variant="title" serif color={theme.text} style={styles.title}>
          {prompt.title}
        </HText>

        <HText variant="body" serif={false} color={theme.text} style={styles.body}>
          {prompt.body}
        </HText>

        {/* Reflection — fades in after ~1.8s */}
        {prompt.reflection && reflectionVisible && (
          <Animated.View
            style={[
              styles.reflectionBlock,
              { borderTopColor: theme.rule, opacity: reflectionOpacity },
            ]}
          >
            <HText
              variant="caption"
              weight="semibold"
              serif={false}
              color={theme.textSoft}
              style={styles.reflectLabel}
            >
              {t('prompt.reflect').toUpperCase()}
            </HText>
            <HText variant="bodySm" serif italic color={theme.textSoft} style={styles.reflection}>
              {prompt.reflection}
            </HText>
          </Animated.View>
        )}
      </Animated.ScrollView>

      {/* ── Action bar ──────────────────────────────────────── */}
      <View
        style={[
          styles.actions,
          {
            paddingBottom: insets.bottom + Spacing.md,
            borderTopColor: theme.rule,
            backgroundColor: theme.bg,
          },
        ]}
      >
        {/* ── Amen button (pre-prayer + during animation) ─────── */}
        {!showDone && (
          <Animated.View style={{ transform: [{ scale: amenScale }] }}>
            <TouchableOpacity
              onPress={handleAmen}
              activeOpacity={hasPrayed ? 1 : 0.85}
              disabled={hasPrayed}
            >
              <Animated.View
                style={[
                  styles.amenBtn,
                  {
                    backgroundColor: amenBg,
                    borderWidth: amenBorderWidth,
                    borderColor: 'rgba(250,247,242,0.2)',
                  },
                ]}
              >
                <HText
                  variant="body"
                  weight="semibold"
                  serif
                  color={hasPrayed ? theme.textSoft : theme.bg}
                  style={styles.amenLabel}
                >
                  {hasPrayed ? `✓  ${t('prompt.action_amen_done')}` : t('prompt.action_amen')}
                </HText>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── Post-prayer: confirmation + Done ─── */}
        {showDone && (
          <Animated.View style={[styles.doneContainer, { opacity: doneOpacity }]}>
            <HText
              variant="caption"
              serif={false}
              color={theme.textSoft}
              center
              style={styles.prayedConfirm}
            >
              {`✓  ${t('prompt.action_amen_done')}`}
            </HText>
            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.85}
              style={[styles.amenBtn, { backgroundColor: 'rgba(250,247,242,0.95)' }]}
            >
              <HText variant="body" weight="semibold" serif color={theme.bg} style={styles.amenLabel}>
                {t('common.done')}
              </HText>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── Secondary: Another + Share ──────── */}
        <View style={styles.secondaryRow}>
          <TouchableOpacity onPress={handleAnother} activeOpacity={0.7} style={styles.ghostBtn}>
            <HText variant="bodySm" weight="medium" serif={false} color={theme.textSoft}>
              {t('prompt.action_another')}
            </HText>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.rule }]} />

          <TouchableOpacity onPress={handleShare} activeOpacity={0.7} style={styles.ghostBtn}>
            <View style={styles.ghostBtnInner}>
              <Ionicons name="share-outline" size={14} color={theme.textSoft} />
              <HText variant="bodySm" weight="medium" serif={false} color={theme.textSoft}>
                {t('prompt.share')}
              </HText>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Share preview modal ─────────────────────────────── */}
      <Modal
        visible={shareVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setShareVisible(false)}
      >
        <View style={styles.shareOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShareVisible(false)}
          />
          <View style={styles.shareSheet}>
            {/* Preview of the card, scaled to fit the screen */}
            <View style={styles.cardPreviewWrapper}>
              <View
                style={[
                  styles.cardPreview,
                  {
                    transform: [
                      { translateX: PREVIEW_TX },
                      { translateY: PREVIEW_TY },
                      { scale: PREVIEW_SCALE },
                    ],
                  },
                ]}
                pointerEvents="none"
              >
                <ShareCard prompt={prompt} mode="prayer" />
              </View>
            </View>

            {/* Share actions */}
            <View style={styles.shareActions}>
              <TouchableOpacity
                onPress={handleShareImage}
                activeOpacity={0.8}
                style={styles.shareImageBtn}
                disabled={sharing}
              >
                {sharing ? (
                  <HText variant="body" weight="semibold" serif={false} color={Colors.surfaceElevated}>
                    …
                  </HText>
                ) : (
                  <View style={styles.shareImageBtnInner}>
                    <Ionicons name="share-outline" size={18} color={Colors.surfaceElevated} />
                    <HText variant="body" weight="semibold" serif={false} color={Colors.surfaceElevated}>
                      {t('prompt.share')}
                    </HText>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShareVisible(false)}
                activeOpacity={0.7}
                style={styles.shareCancelBtn}
              >
                <HText variant="bodySm" serif={false} color={Colors.textSecondary}>
                  {t('common.cancel')}
                </HText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  offScreen: { position: 'absolute', left: -9999, top: -9999 },

  // ── Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  closeBtn: { padding: Spacing.sm },

  // ── Content
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  rule: { width: 28, height: 2, borderRadius: 1, marginBottom: Spacing.xl },
  title: { marginBottom: Spacing.lg, lineHeight: 34 },
  body: { lineHeight: 28 },
  reflectionBlock: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  reflectLabel: { letterSpacing: 1.2 },
  reflection: { lineHeight: 24 },

  // ── Actions
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },

  // Amen button
  amenBtn: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: Radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenLabel: {
    ...Typography.button.lg,
    fontFamily: Platform.OS === 'android' ? 'serif' : 'Georgia',
  },

  // Post-prayer done state
  doneContainer: {
    gap: Spacing.sm,
  },
  prayedConfirm: {
    letterSpacing: 0.5,
    opacity: 0.7,
  },

  // Secondary
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  ghostBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 18,
    opacity: 0.3,
  },

  // ── Share modal
  shareOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,15,12,0.7)',
    justifyContent: 'flex-end',
  },
  shareSheet: {
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  cardPreviewWrapper: {
    width: PREVIEW_W,
    height: PREVIEW_H,
    overflow: 'hidden',
    borderRadius: Radii.xl,
    alignSelf: 'center',
  },
  cardPreview: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  shareActions: { gap: Spacing.sm },
  shareImageBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareImageBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  shareCancelBtn: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
});
