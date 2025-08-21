import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";
import { useHeaderHeight } from "@react-navigation/elements";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export function CameraScreen(
    { cameraHook, dbHook, appData }: { cameraHook: any; dbHook: any; appData: AppData; }
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
        <View style={{ flex: 1 }}>
            {/* CAMERA VIEW - Full screen background */}
            <View style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0,
                width: screenWidth,
                height: screenHeight
            }}>
                {cameraHook.renderCamera()}
            </View>

            {/* PHOTO ROW - Positioned at top with safe area */}
            <SafeAreaView style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 10 
            }} edges={['top']}>
                <View style={{
                    marginTop: headerHeight + 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
                    paddingVertical: 8
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
                        keyExtractor={(_, index) => index.toString()}
                    />
                </View>
            </SafeAreaView>

            {/* CAMERA CONTROLS - Bottom positioned with safe area */}
            <SafeAreaView style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                zIndex: 10 
            }} edges={['bottom']}>
                <View style={{
                    paddingBottom: 16,
                    paddingTop: 16,
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
                }}>
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
                            elevation: 5,
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
                </View>
            </SafeAreaView>
        </View>
    );
}