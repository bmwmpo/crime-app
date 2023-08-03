export default class Region{
    id=-1
  region_name="defualt_name"
  none=[null]
  assault=[-1]
  autotheft=[-1]
  biketheft=[-1]
  breakenter=[-1]
  homicide=[-1]
  robbery=[-1]
  shooting=[-1]
  theftFromMv=[-1]
  theftOver=[-1]
  region_geo=[
    {latitude:0.0, longitude: 0.0},
    {latitude: 10.0, longitude: 10.0},
    {latitude: 20.0, longitude: 20.0}]
center_geo={latitude:10.0, longitude: 10.0}
region_color="rgba(0,0,0,0)"


constructor(id,region_name,assault,autotheft,biketheft,breakenter,homicide,robbery,shooting,theftFromMv,theftOver,region_geo,center_geo){
    this.id=id?id:-1
    this.region_name=region_name?region_name:"DEFAULT_NAME"
    this.assault=assault?assault:[0]
    this.autotheft=autotheft?autotheft:[0]
    this.biketheft=biketheft?biketheft:[0]
    this.breakenter=breakenter?breakenter:[0]
    this.homicide=homicide?homicide:[0]
    this.robbery=robbery?robbery:[0]
    this.shooting=shooting?shooting:[0]
    this.theftFromMv=theftFromMv?theftFromMv:[0]
    this.theftOver=theftOver?theftOver:[0]
    this.geo_translate(region_geo,center_geo)
    }

geo_translate=(region_geo,center_geo)=>{
    // console.log(this.region_name)
    // console.log("obj cen")
    // console.log(center_geo)
    let i = 0
    let translated_geo=[]
    while(i<region_geo.length){
        translated_geo.push({latitude:region_geo[i][1], longitude:region_geo[i][0]})
        i++
    }
    this.region_geo=translated_geo
    this.center_geo={latitude:center_geo[1],longitude:center_geo[0],latitudeDelta: 0.0922, longitudeDelta: 0.0421}
    console.log(this.center_geo)
}

}