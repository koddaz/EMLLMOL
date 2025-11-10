import { useAppTheme } from "@/app/constants/UI/theme";
import { HookData, NavData } from "@/app/navigation/rootNav";
import { CameraView } from "expo-camera";
import { useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export function ImageRow(
    { cameraHook, setSelectedItem, setPreview }: { cameraHook: any, setSelectedItem: any, setPreview: any }
) {
    const { styles, theme } = useAppTheme();

    const screenWidth = Dimensions.get('window').width;
    const slotCount = 3;
    const slotWidth = (screenWidth - 16) / slotCount; // 16 for possible margins

    const paddedPhotoURIs = [
        ...cameraHook.photoURIs,
        ...Array(Math.max(0, slotCount - cameraHook.photoURIs.length)).fill(null)
    ];

    const selectImage = (item: any) => {
        if (item) {
            setSelectedItem(item)
            setPreview(true)
        }
    }

    return (
        <View style={{ alignContent: 'center', justifyContent: 'center', flex: 1 }}>
            <View style={{
                flexDirection: 'row',
                backgroundColor: 'transparent',
                paddingHorizontal: 8,
                maxHeight: 50
            }}>
                {paddedPhotoURIs.map((item, index) => (
                    <View
                        style={[
                            styles.photoItem,
                            {
                                alignItems: 'center',
                                width: slotWidth,
                                height: slotWidth,
                                marginRight: index < slotCount - 1 ? 8 : 0,
                                marginTop: 8
                            }
                        ]}
                        key={index}
                    >
                        <TouchableOpacity
                            style={[
                                styles.imageContainer,
                                {
                                    backgroundColor: theme.colors.surface,
                                    opacity: !item ? 0.1 : 1,
                                    width: '100%',
                                    height: '75%'
                                }
                            ]}
                            disabled={!item}
                            onPress={() => {

                                if (item) {
                                    selectImage(item)
                                    // cameraHook.removePhotoURI(index);
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

export function ImagePreview(
    { cameraHook, selectedItem, setPreview }: { selectedItem: any, cameraHook: any, setPreview: any }
) {

    const { theme, styles } = useAppTheme()

    const handleDelete = () => {
        const index = cameraHook.photoURIs.indexOf(selectedItem);
        if (index !== -1) {
            cameraHook.removePhotoURI(index);
        }
        setPreview(false);
    }

    const handleClose = () => {
        setPreview(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <Image
                source={{ uri: selectedItem }}
                resizeMode="cover"
                style={

                    {
                        flex: 1,
                        borderWidth: 2,
                        borderColor: theme.colors.primary,
                    }
                }
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: theme.colors.primaryContainer }}>

                <IconButton icon="trash-can" iconColor={theme.colors.error} size={40} onPress={handleDelete} />
                <IconButton icon="close" iconColor={theme.colors.onPrimaryContainer} size={40} onPress={handleClose} />

            </View>
        </View>
    );
}

export function CameraScreen(
    { cameraHook, navigation }: NavData & HookData
) {
    const { styles, theme } = useAppTheme();
    const [preview, setPreview] = useState(false);
    const [selectedItem, setSelectedItem] = useState();
    const [showGrid, setShowGrid] = useState(false);

    const insets = useSafeAreaInsets()

    if (preview && selectedItem) return (
        <View style={{ flex: 1 }}>
            <ImagePreview cameraHook={cameraHook} selectedItem={selectedItem} setPreview={setPreview} />
        </View>
    )

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Camera View - Full Screen */}
            {cameraHook.renderCamera()}

            {/* Grid Overlay (Rule of Thirds) */}
            {showGrid && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 500
                }}>
                    {/* Vertical lines */}
                    <View style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                    <View style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                    {/* Horizontal lines */}
                    <View style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                    <View style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                </View>
            )}

            {/* Top Controls Bar */}
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                paddingTop: insets.top + 8,
                paddingBottom: 16,
                paddingHorizontal: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}>
                {/* Close Button - Top Left */}
                <IconButton
                    icon="close"
                    iconColor="#FFFFFF"
                    size={28}
                    onPress={() => navigation?.navigate('addmeal')}
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    }}
                />

                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {/* Grid Toggle */}
                    <IconButton
                        icon="grid"
                        iconColor={showGrid ? theme.colors.secondary : '#FFFFFF'}
                        size={24}
                        onPress={() => setShowGrid(!showGrid)}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        }}
                    />

                    {/* Flash Toggle - Top Right */}
                    <IconButton
                        icon={cameraHook.getFlashIcon()}
                        iconColor={cameraHook.getFlashIconColor()}
                        size={24}
                        onPress={() => cameraHook.cycleFlash()}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        }}
                    />
                </View>
            </View>

            {/* Photo Thumbnails Row - Top */}
            <View style={{ position: 'absolute', top: insets.top + 64, left: 0, right: 0, zIndex: 999 }}>
                <ImageRow cameraHook={cameraHook} setSelectedItem={setSelectedItem} setPreview={setPreview} />
            </View>

            {/* Bottom Controls Bar */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: insets.bottom + 24,
                paddingTop: 24,
                paddingHorizontal: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 1000,
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Gallery Preview Thumbnail - Bottom Left */}
                    <TouchableOpacity
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderWidth: 2,
                            borderColor: '#FFFFFF',
                            overflow: 'hidden',
                        }}
                        onPress={() => {
                            if (cameraHook.photoURIs.length > 0) {
                                setSelectedItem(cameraHook.photoURIs[cameraHook.photoURIs.length - 1]);
                                setPreview(true);
                            }
                        }}
                    >
                        {cameraHook.photoURIs.length > 0 ? (
                            <Image
                                source={{ uri: cameraHook.photoURIs[cameraHook.photoURIs.length - 1] }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                        ) : null}
                    </TouchableOpacity>

                    {/* Capture Button - Center */}
                    <TouchableOpacity
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: 'transparent',
                            borderWidth: 6,
                            borderColor: '#FFFFFF',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => cameraHook.capturePhoto()}
                        activeOpacity={0.8}
                    >
                        <View style={{
                            width: 66,
                            height: 66,
                            borderRadius: 33,
                            backgroundColor: '#FFFFFF',
                        }} />
                    </TouchableOpacity>

                    {/* Camera Flip Button - Bottom Right */}
                    <IconButton
                        icon="camera-flip"
                        iconColor="#FFFFFF"
                        size={28}
                        onPress={() => cameraHook.flipCamera()}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        }}
                    />
                </View>
            </View>

        </View>
    );
}
