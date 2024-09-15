import { Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import CustomTheme from "../../../models/CustomTheme";
import useCustomTheme from "../../../hooks/useCustomTheme";
import MatchFilter from "../../../models/MatchFilter";
import { useState } from "react";
import CustomButton from "../../../components/CustomButton";
import DropDownPicker from "react-native-dropdown-picker";
import { campusOptions } from "../../../models/Campus";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import ModalWrapper from "../../../components/ModalWrapper";

interface Props {
    setFilterModalOpen: (val: boolean) => void
    filter: MatchFilter
    setFilter: (filter: MatchFilter) => void
}

export default function FilterModal({ setFilterModalOpen, filter, setFilter }: Props) {
    const { theme } = useCustomTheme()
    const [styles, setStyles] = useState(getStyles(theme))

    const [isOpenCampusPicker, setIsOpenCampusPicker] = useState(false)

    const [gender, setGender] = useState(filter.gender)
    const [campus, setCampus] = useState(filter.campus)
    const [binusian, setBinusian] = useState(filter.binusian)
    const [minAge, setMinAge] = useState(filter.minAge)
    const [maxAge, setMaxAge] = useState(filter.maxAge)

    function handleCloseModal() {
        setGender(filter.gender)
        setCampus(filter.campus)
        setBinusian(filter.binusian)
        setMinAge(filter.minAge)
        setMaxAge(filter.maxAge)
        setFilterModalOpen(false)
    }

    function handleConfirmUpdateFilter() {
        setFilter({ gender, campus, binusian, minAge, maxAge, offset: 0 })
        setFilterModalOpen(false)
    }

    return (
        <ModalWrapper handleCloseModal={handleCloseModal}>
            <>
                <Text style={styles.titleText}>
                    Filter
                </Text>

                <Text style={styles.subtitleText}>
                    Interested in
                </Text>
                <View style={styles.genderToggleContainer}>
                    {['Male', 'Female'].map((genderOption, index) => {
                        return genderOption.toLowerCase() === gender.toLowerCase() ?
                            <CustomButton key={index}
                                onPress={() => setGender(genderOption)}
                                style={[styles.genderToggleButton, styles.genderToggleButtonActive]}>
                                <Text style={[styles.genderToggleText, styles.genderToggleTextActive]}>
                                    {genderOption}
                                </Text>
                            </CustomButton> :
                            <CustomButton key={index}
                                onPress={() => setGender(genderOption)}
                                style={styles.genderToggleButton}>
                                <Text style={styles.genderToggleText}>
                                    {genderOption}
                                </Text>
                            </CustomButton>
                    })}
                </View>
                <Text style={styles.subtitleText}>
                    Campus Area
                </Text>
                <DropDownPicker style={styles.dropDownPicker}
                    textStyle={styles.dropDownPickerText}
                    containerStyle={{ width: '95%' }}
                    value={campus}
                    setValue={setCampus}
                    items={campusOptions}
                    open={isOpenCampusPicker}
                    setOpen={setIsOpenCampusPicker} />
                <Text style={styles.subtitleText}>
                    Binusian
                </Text>
                <TextInput style={styles.input} placeholder="Binusian" value={binusian} onChangeText={setBinusian} />
                <View style={styles.ageTextContainer}>
                    <Text style={styles.subtitleText}>
                        Age
                    </Text>
                    <Text style={styles.subtitleText}>
                        {minAge} - {maxAge}
                    </Text>
                </View>
                <View style={styles.sliderContainer}>
                    <MultiSlider
                        trackStyle={styles.track}
                        selectedStyle={styles.selectedTrack}
                        markerStyle={styles.marker}
                        min={17} max={118} step={1}
                        allowOverlap={true}
                        values={[minAge, maxAge]}
                        onValuesChange={(values) => {
                            setMinAge(values[0])
                            setMaxAge(values[1])
                        }}
                    />
                </View>
                <CustomButton style={styles.confirmButton} onPress={handleConfirmUpdateFilter}>
                    <Text style={styles.confirmButtonText}>
                        Continue
                    </Text>
                </CustomButton>
            </>
        </ModalWrapper >
    )
}

function getStyles(theme: CustomTheme) {
    return StyleSheet.create({
        modalContainer: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '30%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            position: 'relative',
            flex: 1,
            backgroundColor: theme.background,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignItems: 'center',
            elevation: 5,
            width: '100%',
            padding: 20,
        },
        titleText: {
            fontSize: 28,
            fontFamily: 'ABeeZee',
            color: theme.text,
            padding: 20
        },
        subtitleText: {
            fontSize: 18,
            fontFamily: 'ABeeZee',
            color: theme.text,
            padding: 10,
        },
        genderToggleContainer: {
            flexDirection: 'row',
            width: '95%',
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 20,
            borderRadius: 20,
            overflow: 'hidden'
        },
        genderToggleButton: {
            width: '50%',
            borderRadius: 0,
            padding: 20,
            backgroundColor: theme.background,
            borderColor: theme.text,
        },
        genderToggleButtonActive: {
            backgroundColor: theme.primary,
        },
        genderToggleText: {
            color: theme.text,
            fontSize: 16,
            fontFamily: 'ABeeZee',
        },
        genderToggleTextActive: {
            color: 'white',
        },
        dropDownPicker: {
            alignSelf: 'center',
            marginBottom: 20
        },
        dropDownPickerText: {
            fontSize: 18,
            fontFamily: 'ABeeZee',
        },
        input: {
            width: '95%',
            borderColor: theme.text,
            borderWidth: 1,
            borderRadius: 5,
            fontSize: 18,
            fontFamily: 'ABeeZee',
            padding: 10,
            color: theme.text,
            backgroundColor: theme.background,
            marginBottom: 29
        },
        ageTextContainer: {
            width: '95%',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            backgroundColor: theme.background,
        },
        track: {
            backgroundColor: 'lightgrey',
            height: 5,
        },
        selectedTrack: {
            backgroundColor: theme.primary,
            height: 5,
        },
        marker: {
            backgroundColor: theme.primary,
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: 'white',
        },
        sliderContainer: {
            marginBottom: 20
        },
        confirmButton: {
            width: '95%'
        },
        confirmButtonText: {
            color: 'white',
            fontSize: 18,
            fontFamily: 'ABeeZee'
        }
    })
}