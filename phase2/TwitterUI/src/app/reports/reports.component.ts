import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4plugins_wordCloud from '@amcharts/amcharts4/plugins/wordCloud';
import {HttpClient} from '@angular/common/http';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  private twitterData: any[];
  constructor( private http: HttpClient) {
    this.twitterData = [];
    this.http.get('http://127.0.0.1:5000/api/countries').subscribe(data => {
      // @ts-ignore
      data.forEach(element => {
        const ob = {
          name: '',
          value: '',
          fill: null
        };
        ob.name = element.Country;
        ob.value = element.Count;
        ob.fill = am4core.color('#F05C5C');
        // @ts-ignore
        this.twitterData.push(ob);
      });
    });
  }

  ngOnInit() {
    // Global Map
    this.getGraphData('http://127.0.0.1:5000/api/countries').subscribe(data => {
      this.initChartGlobe(data);
    });
    // Devices based  tweets
    this.getGraphData('http://127.0.0.1:5000/api/phone').subscribe(data => {
      // @ts-ignore
      const result = data.sort((a, b) => b.Total - a.Total).slice(0, 9);
      console.log(result);
      this.initChartBarClustered('deviceTweetsPlot', 'Device based Tweets', result);
    });
    this.getGraphData('http://127.0.0.1:5000/api/events').subscribe(data => {
      // @ts-ignore
      const result = data.sort((a, b) => b.Total - a.Total).slice(0, 9);
      this.initChartBar('eventTweetsPlot', 'Country wise response to Avengers', result);
    });

    this.getGraphData('http://127.0.0.1:5000/api/hashtags').subscribe(data => {
      // @ts-ignore
      this.initChartWords('trendingHashtagsPlot', 'Trending Hash Tags', data);
    });
    // Language Based Tweets
    this.getGraphData('http://127.0.0.1:5000/api/language').subscribe(data => {
      // @ts-ignore
      const result = data.slice(0, 9);
      this.initChartPie('languageWisePlot', 'Language wise Tweets Count', result);
    });
    this.getGraphData('http://127.0.0.1:5000/api/retweets').subscribe(data => {
      // @ts-ignore
      const result = data.slice(0, 9);
      this.initChartBarProfile('highestRetweets', 'Highest Retweets on', result);
    });

    this.getGraphData('http://127.0.0.1:5000/api/verified').subscribe(data => {
      // @ts-ignore
      const result = data.sort((a, b) => b.Total - a.Total).slice(0, 9);
      this.initChartVerifiedBarClustered('verifiedRetweets', 'Verified Account vs Non Verified Account', result);
    });

    this.getGraphData('http://127.0.0.1:5000/api/verified').subscribe(data => {
      // @ts-ignore
      const result = data.sort((a, b) => b.Total - a.Total).slice(0, 9);
      this.initChartVerifiedBarClustered('verifiedRetweets', 'Verified Account vs Non Verified Account', result);
    });

    this.getGraphData('http://127.0.0.1:5000/api/iplteams').subscribe(data => {
      // @ts-ignore
      this.initChartIcon(data);
    });

    this.getGraphData('http://127.0.0.1:5000/api/alerts').subscribe(data => {
      // @ts-ignore
      this.initChartBarAlerts('alertsTweets', 'Alerts Wise Tweets', data);
    });

    this.initChartBarText('textTweets', 'Tweets text length Analysis', null);

  }
  getGraphData(url) {
    return this.http.get(url);
  }
  initChartBar(divID, graphTitle, result) {
    const chart = am4core.create(divID, am4charts.XYChart3D);
    const title = chart.titles.create();
    title.text = graphTitle;
    title.fontSize = 25;
    title.marginBottom = 30;
    chart.data = result;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.grid.template.disabled = true;

    const labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = -90;
    labelTemplate.horizontalCenter = 'left';
    labelTemplate.verticalCenter = 'middle';
    labelTemplate.dy = 10; // moves it a bit down;
    labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;

// Create series
    const series = chart.series.push(new am4charts.ConeSeries());
    series.dataFields.valueY = 'total';
    series.dataFields.categoryX = 'country';

    const columnTemplate = series.columns.template;
    columnTemplate.adapter.add('fill', (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

    columnTemplate.adapter.add('stroke', (stroke, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });
  }

  initChartGlobe(data) {
    const chart2 = am4core.create('countryTweetsPlot', am4maps.MapChart);

    const title = chart2.titles.create();
    title.text = 'Country wise Tweets';
    title.fontSize = 25;
    title.marginBottom = 30;
    title.stroke = am4core.color('white');

// Set map definition
    chart2.geodata = am4geodata_worldLow;

// Set projection
    chart2.projection = new am4maps.projections.Orthographic();
    chart2.panBehavior = 'rotateLongLat';
    chart2.deltaLatitude = -20;
    chart2.padding(20, 20, 20, 20);

// Create map polygon series
    const polygonSeries = chart2.series.push(new am4maps.MapPolygonSeries());

// Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

// Configure series
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name} : {value}';
    polygonTemplate.fill = am4core.color('#47c78a');
    polygonTemplate.stroke = am4core.color('#454a58');
    polygonTemplate.strokeWidth = 0.5;
    polygonSeries.data = data;
    // polygonSeries.data = this.twitterData;

    polygonTemplate.propertyFields.fill = 'fill';

    const graticuleSeries = chart2.series.push(new am4maps.GraticuleSeries());
    graticuleSeries.mapLines.template.line.stroke = am4core.color('#ffffff');
    graticuleSeries.mapLines.template.line.strokeOpacity = 0.08;
    graticuleSeries.fitExtent = false;


    chart2.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0.1;
    chart2.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color('#ffffff');

// Create hover state and set alternative fill color
    const hs = polygonTemplate.states.create('hover');
    hs.properties.fill = chart2.colors.getIndex(0).brighten(-0.5);

    let animation;
    setTimeout(() => {
      animation = chart2.animate({property: 'deltaLongitude', to: 100000}, 20000000);
    }, 3000);

    chart2.seriesContainer.events.on('down', () => {
      if (animation) {
        animation.stop();
      }
    });
  }

  initChartWords(divID, graphTitle, result) {
    const chart = am4core.create(divID, am4plugins_wordCloud.WordCloud);
    const title = chart.titles.create();
    title.text = graphTitle;
    title.fontSize = 25;
    title.marginBottom = 30;

    const series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

    series.accuracy = 4;
    series.step = 15;
    series.rotationThreshold = 0.7;
    series.maxCount = 200;
    series.minWordLength = 2;
    series.labels.template.margin(4, 4, 4, 4);
    series.maxFontSize = am4core.percent(30);

    // series.text = 'Though yet of Hamlet our dear brother\'s death The memory be green, and that it us befitted To bear our hearts in grief and our whole kingdom To be contracted in one brow of woe, Yet so far hath discretion fought with nature That we with wisest sorrow think on him, Together with remembrance of ourselves. Therefore our sometime sister, now our queen, The imperial jointress to this warlike state, Have we, as \'twere with a defeated joy,-- With an auspicious and a dropping eye, With mirth in funeral and with dirge in marriage, In equal scale weighing delight and dole,-- Taken to wife: nor have we herein barr\'d Your better wisdoms, which have freely gone With this affair along. For all, our thanks. Now follows, that you know, young Fortinbras, Holding a weak supposal of our worth, Or thinking by our late dear brother\'s death Our state to be disjoint and out of frame, Colleagued with the dream of his advantage, He hath not fail\'d to pester us with message, Importing the surrender of those lands Lost by his father, with all bonds of law, To our most valiant brother. So much for him. Now for ourself and for this time of meeting: Thus much the business is: we have here writ To Norway, uncle of young Fortinbras,-- Who, impotent and bed-rid, scarcely hears Of this his nephew\'s purpose,--to suppress His further gait herein; in that the levies, The lists and full proportions, are all made Out of his subject: and we here dispatch You, good Cornelius, and you, Voltimand, For bearers of this greeting to old Norway; Giving to you no further personal power To business with the king, more than the scope Of these delated articles allow. Farewell, and let your haste commend your duty. Tis sweet and commendable in your nature, Hamlet,To give these mourning duties to your father: But, you must know, your father lost a father; That father lost, lost his, and the survivor bound In filial obligation for some term To do obsequious sorrow: but to persever In obstinate condolement is a course Of impious stubbornness; \'tis unmanly grief; It shows a will most incorrect to heaven, A heart unfortified, a mind impatient, An understanding simple and unschool\'d: For what we know must be and is as common As any the most vulgar thing to sense, Why should we in our peevish opposition Take it to heart? Fie! \'tis a fault to heaven, A fault against the dead, a fault to nature, To reason most absurd: whose common theme Is death of fathers, and who still hath cried, From the first corse till he that died to-day, \'This must be so.\' We pray you, throw to earth This unprevailing woe, and think of us As of a father: for let the world take note, You are the most immediate to our throne; And with no less nobility of love Than that which dearest father bears his son, Do I impart toward you. For your intent In going back to school in Wittenberg, It is most retrograde to our desire: And we beseech you, bend you to remain Here, in the cheer and comfort of our eye, Our chiefest courtier, cousin, and our son.';
    series.data = result;
    series.dataFields.word = 'Hashtags';
    series.dataFields.value = 'Frequency';
    series.colors = new am4core.ColorSet();
    series.colors.passOptions = {}; // makes it loop

// series.labelsContainer.rotation = 45;
    series.angles = [0, -90];
    series.fontWeight = '700';

    setInterval(() => {
      series.dataItems.getIndex(Math.round(
        Math.random() * (series.dataItems.length - 1))).setValue('value', Math.round(Math.random() * 10));
    }, 10000);
  }

  initChartBarClustered(divID, graphTitle, data) {
    const chart = am4core.create(divID, am4charts.XYChart3D);
    chart.colors.list = [
      am4core.color('#6771dc'),
      am4core.color('green')
    ];
// Add data
    chart.data = data;
    const title = chart.titles.create();
    title.text = graphTitle;
    title.fontSize = 25;
    title.marginBottom = 30;

    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    const marker = chart.legend.markers.template.children.getIndex(0);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('#ccc');
// Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'Country';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0;
    categoryAxis.renderer.cellEndLocation = 1;
    categoryAxis.renderer.minGridDistance = 50;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'No of tweets';
    valueAxis.renderer.labels.template.adapter.add('text', function(text) {
      return text ;
    });

    const labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = 40;
    labelTemplate.horizontalCenter = 'left';
    labelTemplate.verticalCenter = 'middle';
    labelTemplate.dy = 10; // moves it a bit down;
    labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

// Create series
    const series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = 'Iphone';
    series.dataFields.categoryX = 'Country';
    series.name = 'Iphone';
    series.clustered = false;
    series.columns.template.tooltipText = 'Tweets from Iphone in {categoryX}: [bold]{valueY}[/]';
    series.columns.template.fillOpacity = 0.9;

    const series2 = chart.series.push(new am4charts.ColumnSeries3D());
    series2.dataFields.valueY = 'Android';
    series2.dataFields.categoryX = 'Country';
    series2.name = 'Android';
    series2.clustered = false;
    series2.columns.template.tooltipText = 'Tweets from Android in {categoryX}: [bold]{valueY}[/]';
  }

  initChartVerifiedBarClustered(divID, graphTitle, data) {
    const chart = am4core.create(divID, am4charts.XYChart3D);
    chart.colors.list = [
      am4core.color('#6771dc'),
      am4core.color('#ad51a3')
    ];
// Add data
    chart.data = data;
    const title = chart.titles.create();
    title.text = graphTitle;
    title.fontSize = 25;
    title.marginBottom = 30;

    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    const marker = chart.legend.markers.template.children.getIndex(0);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('#ccc');
// Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'Country';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0;
    categoryAxis.renderer.cellEndLocation = 1;
    categoryAxis.renderer.minGridDistance = 50;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'No of tweets';
    valueAxis.renderer.labels.template.adapter.add('text', function(text) {
      return text ;
    });

    const labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = 40;
    labelTemplate.horizontalCenter = 'left';
    labelTemplate.verticalCenter = 'middle';
    labelTemplate.dy = 10; // moves it a bit down;
    labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

// Create series
    const series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = 'Verified';
    series.dataFields.categoryX = 'Country';
    series.name = 'Verified';
    series.clustered = false;
    series.columns.template.tooltipText = 'Tweets from verified accounts in {categoryX}: [bold]{valueY}[/]';
    series.columns.template.fillOpacity = 0.9;

    const series2 = chart.series.push(new am4charts.ColumnSeries3D());
    series2.dataFields.valueY = 'Nonverified';
    series2.dataFields.categoryX = 'Country';
    series2.name = 'Nonverified';
    series2.clustered = false;
    series2.columns.template.tooltipText = 'Tweets from Non verified accounts in {categoryX}: [bold]{valueY}[/]';
  }


  initChartPie(divID, graphTitle, data) {
    const chart = am4core.create(divID, am4charts.PieChart);
    const title = chart.titles.create();
    title.text = graphTitle;
    title.fontSize = 25;
    title.marginBottom = 30;
// Add data
    chart.data = data;

// Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'total';
    pieSeries.dataFields.category = 'language';
    pieSeries.innerRadius = am4core.percent(50);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    const rgm = new am4core.RadialGradientModifier();
    rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, - 0.5);
    pieSeries.slices.template.fillModifier = rgm;
    pieSeries.slices.template.strokeModifier = rgm;
    pieSeries.slices.template.strokeOpacity = 0.4;
    pieSeries.slices.template.strokeWidth = 0;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right';

  }

  initChartBarProfile(divID, graphTitle, data) {
    const chart = am4core.create(divID, am4charts.XYChart);
    const title = chart.titles.create();
    title.text = graphTitle;
    title.fontSize = 25;
    title.marginBottom = 30;
// Add data
//     chart.data = [{
//       name: 'John',
//       points: 35654,
//       color: chart.colors.next(),
//       bullet: 'https://www.amcharts.com/lib/images/faces/A04.png'
//     }, {
//       name: 'Damon',
//       points: 65456,
//       color: chart.colors.next(),
//       bullet: 'https://www.amcharts.com/lib/images/faces/C02.png'
//     }, {
//       name: 'Patrick',
//       points: 45724,
//       color: chart.colors.next(),
//       bullet: 'https://www.amcharts.com/lib/images/faces/D02.png'
//     }, {
//       name: 'Mark',
//       points: 13654,
//       color: chart.colors.next(),
//       bullet: 'https://www.amcharts.com/lib/images/faces/E01.png'
//     }];
    chart.data = data;
// Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'ScreenName';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.labels.template.fill = am4core.color('#fff');
    categoryAxis.renderer.labels.template.fontSize = 20;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeDasharray = '4,4';
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

// Do not crop bullets
    chart.maskBullets = false;

// Remove padding
    chart.paddingBottom = 0;

// Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'RetweetCount';
    series.dataFields.categoryX = 'ScreenName';
    series.columns.template.propertyFields.fill = 'color';
    series.columns.template.propertyFields.stroke = 'color';
    series.columns.template.column.cornerRadiusTopLeft = 15;
    series.columns.template.column.cornerRadiusTopRight = 15;
    series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/b]';

// Add bullets
    const bullet = series.bullets.push(new am4charts.Bullet());
    const image = bullet.createChild(am4core.Image);
    image.horizontalCenter = 'middle';
    image.verticalCenter = 'bottom';
    image.dy = 20;
    image.y = am4core.percent(100);
    image.propertyFields.href = 'ImageUrl';
    image.tooltipText = series.columns.template.tooltipText;
    image.propertyFields.fill = 'color';
    image.filters.push(new am4core.DropShadowFilter());
  }

  initChartIcon(data) {
// Create chart instance
    const chart = am4core.create('iplTeams', am4charts.XYChart);

    const title = chart.titles.create();
    title.text = 'IPL Team wise Tweets';
    title.fontSize = 25;
    title.marginBottom = 30;

    chart.hiddenState.properties.opacity = 0;
    chart.defaultState.transitionDuration = 5000;

// Add data
//     chart.data = [{
//       category: 'Burj Khalifa',
//       height: 828,
//       ratio: 1 / 5.12,
//       icon: icon1
//     }, {
//       category: 'Willis Tower',
//       height: 527,
//       ratio: 1 / 5.06,
//       icon: icon2
//     }, {
//       category: 'Taipei 101',
//       height: 508,
//       ratio: 1 / 6.73,
//       icon: icon3
//     }, {
//       category: 'Petronas Towers',
//       height: 452,
//       ratio: 1 / 2.76,
//       icon: icon4
//     }, {
//       category: 'Empire State Building',
//       height: 449,
//       ratio: 1 / 3.41,
//       icon: icon5
//     }];
    for (const i in data) {
      data[i].ratio = 1;
    }
    chart.data = data;
// Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'Team';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.fill = am4core.color('#ffffff');
    categoryAxis.renderer.labels.template.fillOpacity = 0.5;
    categoryAxis.renderer.inside = true;

    chart.paddingBottom = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 10000;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.grid.template.strokeDasharray = '4,4';
    valueAxis.renderer.minLabelPosition = 0.05;

// Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'Count';
    series.dataFields.categoryX = 'Team';
    series.columns.template.disabled = true;

    const bullet = series.bullets.push(new am4charts.Bullet());
    bullet.defaultState.properties.opacity = 0.5;

    const hoverState = bullet.states.create('hover');
    hoverState.properties.opacity = 0.9;

    const image = bullet.createChild(am4core.Image);
    image.horizontalCenter = 'middle';
    image.verticalCenter = 'top';

    image.propertyFields.href = 'URL';
    image.height = am4core.percent(100);
    image.propertyFields.widthRatio = '{ratio}';

    bullet.events.on('positionchanged', (event) => {
      event.target.deepInvalidate();
    });

    const label = series.bullets.push(new am4charts.LabelBullet());
    label.label.text = '{Count} Tweets';
    label.dy = -15;

    const gradient = new am4core.LinearGradient();
    gradient.addColor(am4core.color('#68a5f0'));
    gradient.addColor(am4core.color('#72c2ca'));
    gradient.addColor(am4core.color('#43d5ff'));
    gradient.rotation = 90;
    chart.background.fill = gradient;
  }

  initChartBarAlerts(divID, graphTitle, result) {
    const chart = am4core.create(divID, am4charts.XYChart3D);
    const title = chart.titles.create();
    title.text = graphTitle;
    title.fontSize = 25;
    title.marginBottom = 30;
    chart.data = result;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'Country';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.grid.template.disabled = true;

    const labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = -90;
    labelTemplate.horizontalCenter = 'left';
    labelTemplate.verticalCenter = 'middle';
    labelTemplate.dy = 10; // moves it a bit down;
    labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;

// Create series
    const series = chart.series.push(new am4charts.ConeSeries());
    series.dataFields.valueY = 'Totalalerts';
    series.dataFields.categoryX = 'Country';

    const columnTemplate = series.columns.template;
    columnTemplate.adapter.add('fill', (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

    columnTemplate.adapter.add('stroke', (stroke, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });
  }


  initChartBarText(divID, graphTitle, result) {
    const chart = am4core.create(divID, am4charts.XYChart3D);
    const title = chart.titles.create();
    title.text = graphTitle;
    title.fontSize = 25;
    title.marginBottom = 30;

    chart.data = [
      {Length: 'Less than 50', count: 52801},
      {Length: 'Between 50 N 100', count: 34554},
      {Length: 'More than 100', count: 32005}];

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'Length';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.grid.template.disabled = true;

    const labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = -90;
    labelTemplate.horizontalCenter = 'left';
    labelTemplate.verticalCenter = 'middle';
    labelTemplate.dy = 10; // moves it a bit down;
    labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;

// Create series
    const series = chart.series.push(new am4charts.ConeSeries());
    series.dataFields.valueY = 'count';
    series.dataFields.categoryX = 'Length';

    const columnTemplate = series.columns.template;
    columnTemplate.adapter.add('fill', (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });

    columnTemplate.adapter.add('stroke', (stroke, target) => {
      return chart.colors.getIndex(target.dataItem.index);
    });
  }


}
