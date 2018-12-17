import React from 'react';
import { 
	StyleSheet,
	View,
	Text,
	Switch,
	TouchableWithoutFeedback,
	TouchableHighlight,
	TouchableOpacity,
	ImageBackground,
	Image,
	Button,
	Alert,

} from 'react-native';

import BigSlider from 'react-native-big-slider';

export default class Component1 extends React.Component {

    constructor(props) {
    
        super(props);

        this.state = {
			switchValue: false,
			ljus: null,
			Name: '',
			mode: 0,
			strength: 0,
			kallt: false,
			both: true,
			varmt: false,
			klickad: false,
			warm: 2,
			lightoff: null,
			sliderVal: 1, 
        }

	}

	// funktionen körs när allt är inladdat. 
	componentDidMount() {
		let self = this;
		// url till backend
		fetch('http://iot.abbindustrigymnasium.se:3000/grupp4_light/Bla', {
			method: 'GET' 
		}).then((response) => response.json()).then((responseJson) => {
			if (responseJson.Namn == 'Bla'){
				if(responseJson != 0){
					self.setState({
						Name: responseJson.Namn,
						mode: responseJson.Mode,
						strength: responseJson.Styrka,
						warm: responseJson.warm
					})
				}
				else
				alert("No values were returned, empty databse?");
				console.log(this.state);
				// kollar vilken mode
				if (this.state.mode == 0){
					this.setState({ljus: false, lightoff: true});
					
				} else if (this.state.mode == 1){
					this.setState({ljus: true, lightoff: false});
				}


			}
		}).catch((error) => {console.error(error);});	
	
	}
	InsertDataToServer = () =>{
		const { Name } = this.state;
		const { mode } = this.state;
		const { sliderVal } = this.state; 
		const { warm } = this.state;
		
		if (Name!=""){
			var address='http://iot.abbindustrigymnasium.se:3000/grupp4_light/';

			
			fetch(address, {
				method: 'PATCH',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					Namn: Name,
					Mode: mode,
					Styrka: sliderVal,
					warm: warm,

				})
			}).then((response) => response.json()).then((responseJson) => {
				console.log(responseJson);
				
			}).catch((error) => {
				console.log(error);
			});
		}
		else
		console.log("inget namn");
	}

    render() {

        if (!this.props.visible) {
            return false;
        }
        

        return (

            <View 
                style={styles.component}
            >

                <View style={styles.layouts}>

                	<View style={styles.layout1}>

                		<View style={styles.itemcontainer1}>

                			<View style={styles.itemcontainer1Inner}>

                                <View style={styles.item1}>
										<Text 
											style={styles.item1Text}
										>
											GRUPP 4 EN LJUS IDÉ
										</Text>
									</View>

                			</View>

                		</View>

                	</View>
					
                	<View style={styles.layout7}>

                		<View style={styles.itemcontainer7}>

                			<View style={styles.itemcontainer7Inner}>

							
							<TouchableOpacity // ============== PÅ AV KNAPP ===========
								// känner av när man klickar på lampan. 
								onPress={() => {
									// kollar om lampan är på eller av. Med värden som hämtas från backend. 
									if (this.state.mode == 0){ // om lampan är av 
										this.setState({ljus: true, mode: 1, lightoff: false}); // visar bilden när lampan är på och döljer bilden när lampan är av. 
										this.InsertDataToServer(); // skickar värden till backend. 
									} else if (this.state.mode == 1){
										this.setState({both: true, varmt: false, kallt: false, ljus: false, mode: 0, lightoff: true}); 
										this.InsertDataToServer();
									}
									
								}}
							>	
								{this.state.lightoff ? (

									<View style={styles.ljus}>

										<Image source={require('../../img/screen1/img2km3mk3keujozfzh91.png')} />
									
									</View>

								): null }
									
							
								{this.state.ljus ? (
										// bilden på lampan när lampan är på.
					
									<View style = {styles.ljus}>
										<Image source={require('../../img/screen1/stateon.png')}/>
									</View>

								): null }
							</TouchableOpacity>

                			</View>

                		</View>

                	</View>
                	<View style={styles.layout5}>

                		<View style={styles.itemcontainer5}>

                			<View style={styles.itemcontainer5Inner}>


								<TouchableOpacity
									
									onPress={()=> {


										// om både varmt och kallt är på --> byt till varmt eller kallt beroende på ljus 
										if(this.state.both == true){
											// om man har varit på kallt innan byt till varmt
											if(this.state.klickad == true){

												this.setState({both: false, varmt: true, warm: 1, klickad: false});
												console.log(this.state.both, this.state.warm, this.state.kallt, this.state.varmt, this.state.klickad);
												this.InsertDataToServer();
											// annars byt till kallt
											} else {

												this.setState({kallt: true, varm: false, both: false, warm: 3});
												console.log(this.state.both, this.state.warm, this.state.kallt, this.state.varmt, this.state.klickad);
												this.InsertDataToServer();
											}
											
										// om kallt är på --> byt till både varmt och kallt. 
										}else if (this.state.kallt == true){
											
											this.setState({both: true, kallt: false, klickad: true, warm: 2});
											console.log(this.state.both, this.state.warm, this.state.kallt, this.state.varmt, this.state.klickad);
											this.InsertDataToServer();
										// om varmt är på --> byt till både varmt och kallt.
										}else if (this.state.varmt== true){

											this.setState({both: true, varmt: false, warm: 2});
											console.log(this.state.both, this.state.warm, this.state.kallt, this.state.varmt, this.state.klickad);
											this.InsertDataToServer();
										}
									}}
								>	
									
									{this.state.kallt ? (
										<View style={styles.ljus}>
											<Image source={require('../../img/screen1/right.png')}/>
										</View>

									): null }

									{this.state.both ? (
										<View style={styles.ljus}>
											<Image source={require('../../img/screen1/middle.png')}/>
										</View>

									): null }

									{this.state.varmt ? (
										<View style={styles.ljus}>
											<Image source={require('../../img/screen1/left.png')}/>
										</View>

									): null }
									
								</TouchableOpacity>
                			</View>

                		</View>

                	</View>

                	<View style={styles.layout8}>

                		<View style={styles.itemcontainer8}>

                			<View style={styles.itemcontainer8Inner}>

                                <View style={styles.slider}>
								<BigSlider minimumValue={1}
								maximumValue= {1024}
											label={`${this.state.sliderVal.toFixed(1)}`}
											value={this.state.sliderVal} 
											onValueChange={sliderVal => {this.setState({ sliderVal })}} 
											onValueComplete={this.InsertDataToServer()}
											/>
										
										
								
								</View>
									
                			</View>

                		</View>

                	</View>
                	<View style={styles.layout4}>

                		<View style={styles.itemcontainer4}>

                			<View style={styles.itemcontainer4Inner}>

                                <View style={styles.item6}>
										<Text 
											style={styles.item6Text}
										>
											Ecomode
										</Text>
									</View>

                			</View>

                		</View>

                	</View>
                	<View style={styles.layout3}>

                		<View style={styles.itemcontainer3}>

                			<View style={styles.itemcontainer3Inner}>

                                <View style={styles.item7}>
										<Switch 
											value={this.state.switchValue}
											onValueChange={(val) => this.setState({ switchValue : val })}
										/>
									</View>

                			</View>

                		</View>

                	</View>
                	
                </View>

            </View>
            
        );

    }

}

const styles = StyleSheet.create({
    
	component: {
	    width: '100%',
	    flexDirection: 'row',
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	},
	
	layouts: {
	    flexDirection: 'row',
		flexWrap: 'wrap',
		
	},
	
	layout1: {
	    width: '100%',
	    height: 90,
	},
	
	itemcontainer1: {
	    width: '100%',
	    height: '100%',
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	},
	
	itemcontainer1Inner: {
	    width: '100%',
	    height: '100%',
	    position: 'relative',
	    alignItems: 'center',
	    justifyContent: 'center',
	},
	
	item1: {
	    width: '100%',
	    height: '100%',
	    alignItems: 'center',
	    justifyContent: 'center',
	    overflow: 'hidden',
	    padding: 10,
	},
	
	item1Text: {
	    color: '#181818',
	    fontSize: 14,
	    textAlign: 'center',
	    width: '100%',
	},
	
	layout7: {
	    width: '100%',
	    height: 279,
	},
	
	itemcontainer7: {
	    width: '100%',
	    height: '100%',
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	},
	
	itemcontainer7Inner: {
	    width: '100%',
	    height: '100%',
	    position: 'relative',
	    alignItems: 'center',
	    justifyContent: 'center',
	},
	
	item2: {
	    width: '100%',
	    height: '100%',
		overflow: 'hidden',
		
		top: '75%',
		left: '0%',
	},
	
	layout5: {
	    width: '41.66666666666667%',
	    height: 85.5,
	},
	
	itemcontainer5: {
	    width: '100%',
	    height: '100%',
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	},
	
	itemcontainer5Inner: {
	    width: '100%',
	    height: '100%',
	    position: 'relative',
	    alignItems: 'center',
		justifyContent: 'center',
		left: '75%' 
	},
	
	item3: {
	    backgroundColor: 'rgba(255,193,7,1)',
	    borderWidth: 0,
	    borderColor: '#eee',
	    borderStyle: 'solid',
	    borderRadius: 4,
	    width: '100%',
	    height: '100%',
	    justifyContent: 'center',
	    alignItems: 'center',
	    overflow: 'hidden',
		padding: 10,
		left: '25%'
	},
	
	varm: {
	    color: '#fff',
	    fontSize: 14,
	    textAlign: 'center',
	    width: '100%',
	},
	
	layout6: {
	    width: '41.66666666666667%',
	    height: 85.5,
	},
	
	itemcontainer6: {
	    width: '100%',
	    height: '100%',
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	},
	
	itemcontainer6Inner: {
	    width: '100%',
	    height: '100%',
	    position: 'relative',
	    alignItems: 'center',
	    justifyContent: 'center',
	},
	
	item4: {
	    backgroundColor: 'rgba(3,169,244,1)',
	    borderWidth: 0,
	    borderColor: '#eee',
	    borderStyle: 'solid',
	    borderRadius: 4,
	    width: '100%',
	    height: '100%',
	    justifyContent: 'center',
	    alignItems: 'center',
	    overflow: 'hidden',
		padding: 10,
		left: '25%',
	},
	
	kallt: {
	    color: '#fff',
	    fontSize: 14,
	    textAlign: 'center',
	    width: '100%',
	},
	
	layout8: {
	    width: '100%',
	    height: "100%"
	},
	
	itemcontainer8: {
	    width: '100%',
	    height: '100%',
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	},
	
	itemcontainer8Inner: {
	    width: '100%',
	    height: '100%',
	    position: 'relative',
	    alignItems: 'center',
	    justifyContent: 'center',
	},
	
	item5: {
	    width: '100%',
	    height: '100%',
	    alignItems: 'center',
	    justifyContent: 'center',
	    overflow: 'hidden',
	    padding: 10,
	},
	
	item5Text: {
	    color: '#181818',
	    fontSize: 14,
	    textAlign: 'center',
	    width: '100%',
	},
	
	layout4: {
	    width: '41.66666666666667%',
	    height: 118.5,
	},
	
	itemcontainer4: {
	    width: '100%',
	    height: '100%',
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	},
	
	itemcontainer4Inner: {
	    width: '100%',
	    height: '100%',
	    position: 'relative',
	    alignItems: 'center',
	    justifyContent: 'center',
	},
	
	item6: {
	    width: '100%',
	    height: '100%',
	    alignItems: 'center',
	    justifyContent: 'center',
	    overflow: 'hidden',
	    padding: 10,
	},
	
	item6Text: {
	    color: '#181818',
	    fontSize: 14,
	    textAlign: 'center',
	    width: '100%',
	},
	
	layout3: {
	    width: '41.66666666666667%',
	    height: 124.5,
	},
	
	itemcontainer3: {
	    width: '100%',
	    height: '100%',
	    paddingTop: 7.5,
	    paddingBottom: 7.5,
	    paddingLeft: 7.5,
	    paddingRight: 7.5,
	},
	
	itemcontainer3Inner: {
	    width: '100%',
	    height: '100%',
	    position: 'relative',
	    alignItems: 'center',
	    justifyContent: 'center',
	},
	
	item7: {
	    width: '100%',
	    height: '100%',
	    alignItems: 'center',
	    justifyContent: 'center',
	    overflow: 'hidden',
	},

	ljus:{

		position:"relative"

	},

	slider:{
		position: 'relative', 
		paddingBottom: 1050
		

	
	},
	
});