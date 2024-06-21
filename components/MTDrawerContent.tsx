import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { View, Image, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemeSwitchButton from './ThemeSwitchButton';

export default function MTDrawerContent(props: any) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View className='flex-1'>
      <View className={`bg-red-500 h-[${String(20 + top)}px]`}>
      </View>
      <DrawerContentScrollView {...props} scrollEnabled={false} contentContainerStyle={{ paddingTop: 0 }}>
        <View className="h-44 flex justify-center items-center pb-3">
          <Image
            source={require('../assets/images/drawer-header-01.jpg')}
            className="h-full w-[100%]"
          />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View className={`border-t-[1px] border-gray-400 p-5 pb-${20 + bottom}`}>
        <ThemeSwitchButton />
      </View>
    </View>
  );
}
