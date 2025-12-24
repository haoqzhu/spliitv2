import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Icon sf="ellipsis.circle" drawable="custom_settings_drawable" />
        <Label>Explore</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <Icon sf="person.crop.circle.fill" drawable="custom_settings_drawable" />
        <Label>Account</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
