import { Text, TouchableOpacity, View } from 'react-native';

type NotificationType = 'success' | 'warning' | 'error';

type NotificationBarProps = {
  visible: boolean;
  type: NotificationType;
  message: string;
  onClose: () => void;
};

const containerByType: Record<NotificationType, string> = {
  success: 'bg-green-600',
  warning: 'bg-amber-500',
  error: 'bg-red-600',
};

export default function NotificationBar({
  visible,
  type,
  message,
  onClose,
}: NotificationBarProps) {
  if (!visible) {
    return null;
  }

  return (
    <View className="absolute top-10 left-4 right-4 z-50">
      <View className={`rounded-xl px-4 py-3 shadow-md ${containerByType[type]}`}>
        <View className="flex-row items-start justify-between gap-3">
          <Text className="text-white text-sm flex-1 leading-5">{message}</Text>
          <TouchableOpacity onPress={onClose} accessibilityRole="button" hitSlop={10}>
            <Text className="text-white font-bold text-base">X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}