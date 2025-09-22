import { AppData } from "@/app/constants/interface/appData";
import { useAppTheme } from "@/app/constants/UI/theme";

import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export function ImageRow(
    { cameraHook }: { cameraHook: any }
) {
    const { styles, theme } = useAppTheme();

    const screenWidth = Dimensions.get('window').width;
    const slotCount = 3;
    const slotSpacing = 8 * 2; // paddingHorizontal: 8 on both sides
    const slotWidth = (screenWidth - slotSpacing - 16) / slotCount; // 16 for possible margins

    const paddedPhotoURIs = [
        ...cameraHook.photoURIs,
        ...Array(Math.max(0, slotCount - cameraHook.photoURIs.length)).fill(null)
    ];

    return (
        <View style={[styles.box, { borderWidth: 0 }]}>
            <View style={{
                flexDirection: 'row',
                backgroundColor: 'transparent',
                paddingHorizontal: 8
            }}>
                {paddedPhotoURIs.map((item, index) => (
                    <View
                        style={[
                            styles.photoItem,
                            {
                                width: slotWidth,
                                height: slotWidth,
                                marginRight: index < slotCount - 1 ? 8 : 0,
                            }
                        ]}
                        key={index}
                    >
                        <TouchableOpacity
                            style={[
                                styles.imageContainer,
                                {
                                    width: '100%',
                                    height: '100%'
                                }
                            ]}
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
                                    style={[
                                        styles.imageContainer,
                                        {
                                            width: '100%',
                                            height: '100%',
                                            borderWidth: 2,
                                            borderColor: theme.colors.primary,
                                        }
                                    ]}
                                />
                            ) : (
                                <View
                                    style={[
                                        styles.imageContainer,
                                        {
                                            width: '100%',
                                            height: '100%',
                                            borderWidth: 2,
                                            borderColor: theme.colors.outline,
                                            borderStyle: 'dashed',
                                            backgroundColor: theme.colors.surfaceVariant,
                                        }
                                    ]}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}


export function CameraScreen(
    { cameraHook, dbHook, appData, diaryNav }: { cameraHook: any, dbHook: any, appData: AppData, diaryNav: any }
) {
    const { styles, theme } = useAppTheme();

    return (
        <View style={styles.background}>

            <View>
            <ImageRow cameraHook={cameraHook} />
            </View>


            {cameraHook.renderCamera()}



            <View style={[
                styles.footer,
                {
                    paddingBottom: 8,
                    paddingTop: 8,
                    paddingHorizontal: 16,
                    justifyContent: 'space-between',

                }
            ]}>
                <IconButton
                    iconColor={theme.colors.onSecondary}
                    size={28}
                    icon="close"
                    mode="contained-tonal"
                    onPress={() => diaryNav.goBack()}
                    style={[
                        styles.iconButton,
                        {
                            backgroundColor: theme.colors.secondary,
                            borderRadius: 12,
                        }
                    ]}
                />
                <TouchableOpacity
                    style={[
                        styles.primaryButton,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.secondary,
                            borderWidth: 4,
                            borderRadius: 50,
                            width: 80,
                            height: 80,
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 10,
                        }
                    ]}
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
                    style={[
                        styles.iconButton,
                        {
                            backgroundColor: theme.colors.secondary,
                            borderRadius: 12,
                            zIndex: 1000,
                        }
                    ]}
                />
            </View>

        </View>
    );
}