import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#D3D3D3",
    borderWidth: 1,
    backgroundColor: "#D3D3D3"
  },
  container: {
    flex: 1,
    backgroundColor: "rgb(245,245,245)"
  },
  box: {
    backgroundColor: "white",
    borderColor: "#D3D3D3",
    borderBottomWidth: 1,
    width: "100%",
  },
  box2: {
    backgroundColor: "white",
    borderColor: "#D3D3D3",
    borderBottomWidth: 1,
    width: "100%",
    height: 64
  },
  text:{
    alignItems: 'center',
    textAlign: 'left',
    padding: 6,
    fontWeight: "bold"
  },
  text2: {
    alignItems: 'center',
    textAlign: 'center',
    margin: 6,
    fontWeight: "bold",
    fontFamily: "serif",
    fontSize: 17
  },
  albumText: {
    flex: 1,
    justifyContent: "center"
  },
  headnav: {
   borderWidth: 1
 },
 logo: {
   height: 200,
   width: 200
 },
 artistsImage: {
   height: 240,
   width: 240,
   margin: 10,
 },
 albumImage: {
   height: 64,
   width: 64,
 },
 albumRow: {
   flex: 1,
   flexDirection: "row"
 }

});

export default styles
