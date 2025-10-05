import { useAppTheme } from "@/app/constants/UI/theme";
import { HookData, NavData } from "@/app/navigation/rootNav";
import { useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";


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
    const [preview, setPreview] = useState(false)
    const [selectedItem, setSelectedItem] = useState()

    if (preview && selectedItem) return (
        <View style={{ flex: 1 }}>
            <ImagePreview cameraHook={cameraHook} selectedItem={selectedItem} setPreview={setPreview} />
        </View>
    )

    return (
        <View style={{ flex: 1 }}>

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
                <ImageRow cameraHook={cameraHook} setSelectedItem={setSelectedItem} setPreview={setPreview} />
            </View>

            <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                {cameraHook.renderCamera()}
            </View>

            <View style={
                {
                    position: 'absolute',
                    bottom: 16,
                    left: 0,
                    right: 0,
                }
            }>
                <View style={{ flexDirection: 'row', flex: 1, zIndex: 1000, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(10, 74, 0, 0.5)', paddingHorizontal: 16 }}>
                    <IconButton
                        iconColor={theme.colors.customWarning}
                        size={40}
                        icon="close"
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={
                            {
                                borderWidth: 3,
                                borderColor: theme.colors.customWarning

                            }
                        }
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'transparent',
                            borderColor: theme.colors.secondary,
                            borderWidth: 5,
                            borderRadius: 50,
                            padding: 8,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}
                        onPress={() => { cameraHook.capturePhoto(); }}
                    >
                        <View style={{
                            backgroundColor: theme.colors.secondaryContainer,
                            opacity: 0.6,
                            borderRadius: 50,
                            width: 50,
                            height: 50,
                        }} />
                    </TouchableOpacity>
                    <IconButton
                        iconColor={cameraHook.getFlashIconColor()}
                        size={40}
                        mode="outlined"

                        containerColor="transparent"

                        icon={cameraHook.getFlashIcon()}
                        style={{ borderWidth: 3, borderColor: cameraHook.getFlashIconColor() }}
                        onPress={() => {
                            cameraHook.cycleFlash();
                            console.log('Flash cycled');
                        }}

                    />
                </View>
            </View>

        </View>
    );
}