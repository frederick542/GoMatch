import ContentLoader, { Rect} from "react-content-loader/native"
import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        width: screenWidth * 0.385,
        height: screenWidth * 0.55,
        overflow: 'hidden',
        marginTop: 12
    },
})

export default function loadingComponent() {
    const itemRadius = screenWidth * 0.055
    return (
        <ContentLoader
            speed={2}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={styles.container}
        >
            <Rect width="100%" height="100%"  rx={itemRadius} ry={itemRadius}/>
        </ContentLoader>
    )
}

