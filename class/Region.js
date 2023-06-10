export default class Region{

      region_name="defualt_name"
      assult=-1
      autotheft=-1
      biketheft=-1
      breakenter=-1
      homicide=-1
      robbery=-1
      shooting=-1
      theftFromMv=-1
      theftOver=-1
      region_geo=[
        {latitude:0, longitude: 0},
        {latitude: 10, longitude: 10},
        {latitude: 20, longitude: 20}]


    constructor(region_name,assult,autotheft,biketheft,breakenter,homicide,robbery,shooting,theftFromMv,theftOver,region_geo){
        this.region_name=region_name
        this.assult=assult
        this.autotheft=autotheft
        this.biketheft=biketheft
        this.breakenter=breakenter
        this.homicide=homicide
        this.robbery=robbery
        this.shooting=shooting
        this.theftFromMv=theftFromMv
        this.theftOver=theftOver
        this.geo_translate(region_geo)
        }

    geo_translate=(region_geo)=>{
        let i = 0
        let translated_geo=[]
        while(i<region_geo.length){
            translated_geo.push({latitude:region_geo[i][1], longitude:region_geo[i][0]})
            i++
        }
        this.region_geo=translated_geo
    }
    
}