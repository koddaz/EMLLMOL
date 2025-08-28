import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useHeaderHeight } from "@react-navigation/elements";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export function CameraScreen(
    { cameraHook, dbHook, appData, navigation }: { cameraHook: any, dbHook: any, appData: AppData, navigation: any}
) {
    const { styles, theme } = useAppTheme();
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const slotCount = 3;
    const slotSpacing = 8 * 2; // paddingHorizontal: 8 on both sides
    const slotWidth = (screenWidth - slotSpacing - 16) / slotCount; // 16 for possible margins

    const paddedPhotoURIs = [
        ...cameraHook.photoURIs,
        ...Array(Math.max(0, slotCount - cameraHook.photoURIs.length)).fill(null)
    ];

    return (
        <View style={styles.background}>
            <View style={{
                    paddingTop: headerHeight + 8,
                    backgroundColor: theme.colors.primary, // Semi-transparent background
                    paddingBottom: 8
                }}>
                    <FlatList
                        data={paddedPhotoURIs}
                        horizontal
                        style={{ backgroundColor: 'transparent' }}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 8 }}
                        renderItem={({ item, index }) => (
                            <View
                                style={{
                                    width: slotWidth,
                                    height: slotWidth,
                                    marginRight: index < slotCount - 1 ? 8 : 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'transparent',
                                }}
                                key={index}
                            >
                                <TouchableOpacity
                                    style={{ 
                                        width: '100%', 
                                        height: '100%',
                                        borderRadius: 8,
                                        overflow: 'hidden'
                                    }}
                                    disabled={!item}
                                    onPress={() => {
                                        if (item) {
                                            cameraHook.removePhotoURI(index);
                                        }
                                    }}
                                >
                                    {item ? (
                                        <Image
                                            source={{ uri: item }}
                                            resizeMode="cover"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderWidth: 2,
                                                borderColor: theme.colors.primary,
                                                borderRadius: 8,
                                            }}
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderWidth: 2,
                                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                                borderStyle: 'dashed',
                                                borderRadius: 8,
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            }}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(_, camera) => camera.toString()}
                    />
                </View>


            
            {cameraHook.renderCamera()}
            


            <View style={{
                    flexDirection: 'row',
                    paddingBottom: 16,
                    paddingTop: 8,
                    paddingHorizontal: 16,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: theme.colors.primary // Semi-transparent background
                }}>
                    <IconButton
                            iconColor={theme.colors.onSecondary}
                            size={28}
                            icon="close"
                            mode="contained-tonal"
                            onPress={() => navigation.goBack()}
                            style={{
                                backgroundColor: theme.colors.secondary,
                                borderRadius: 12,
                            }}
                        />
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'white',
                            borderColor: theme.colors.secondary,
                            borderWidth: 4,
                            borderRadius: 50,
                            width: 80,
                            height: 80,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 10,
                        }}
                        onPress={() => { cameraHook.capturePhoto(); }}
                    >
                        <View style={{
                            backgroundColor: theme.colors.secondary,
                            borderRadius: 30,
                            width: 60,
                            height: 60,
                        }} />
                    </TouchableOpacity>
                    <IconButton
                            iconColor={theme.colors.onSecondary}
                            size={28}
                            icon={cameraHook.getFlashIcon()}
                            mode="contained-tonal"
                            onPress={() => {
                                cameraHook.cycleFlash();
                                console.log('Flash cycled');
                            }}
                            style={{
                                backgroundColor: theme.colors.secondary,
                                borderRadius: 12,
                                zIndex: 1000,
                            }}
                        />
                </View>
                
        </View>
    );
}