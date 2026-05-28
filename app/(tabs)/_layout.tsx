import { Tabs } from 'expo-router';

import { LiquidDock } from '@/components/navigation/LiquidDock';
import { TransactionSheetProvider } from '@/context/TransactionSheetContext';

export default function TabLayout() {
  return (
    <TransactionSheetProvider>
      <Tabs
        tabBar={(props) => <LiquidDock {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="charts" options={{ title: 'Charts' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
        <Tabs.Screen name="pro" options={{ title: 'Pro' }} />
      </Tabs>
    </TransactionSheetProvider>
  );
}
