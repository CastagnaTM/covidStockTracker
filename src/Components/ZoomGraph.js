import React, { PureComponent } from 'react';
import {
  Label, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea,
} from 'recharts';
import { convertToRealTime } from '../functions';
import { Ul } from './Styles';
export default class ZoomGraph extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      left : 'dataMin',
      right : 'dataMax',
      refAreaLeft : '',
      refAreaRight : '',
      top : dataMax => (Math.floor(dataMax)+1),
      bottom : dataMin => (Math.floor(dataMin)-1),
      top2 : dataMax => (Math.floor(dataMax)+20),
      bottom2 : dataMin => (Math.floor(dataMin)-20),
      animation : true
    };
  }
  static getDerivedStateFromProps(nextProps) {    
    return {
      data: nextProps.data,
    }
  }
  getAxisYDomain = (from, to, ref, offset) => {
    console.log("FROM", from, "TO", to);

    const refData = this.state.data.slice(from - 1, to);
    // console.log("REFDATA",refData);
    // console.log("DATA",this.state.data);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });
  
    return [(bottom | 0) - offset, (top | 0) + offset];
  }; 
  
  zoom() {
    let { refAreaLeft, refAreaRight, data } = this.state;

    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      this.setState(() => ({
        refAreaLeft: '',
        refAreaRight: '',
      }));
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    // yAxis domain
    // const [bottom, top] = this.getAxisYDomain(refAreaLeft, refAreaRight, 'low_price', 1);
    // const [bottom2, top2] = this.getAxisYDomain(refAreaLeft, refAreaRight, 'high_price', 50);

    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      // bottom,
      // top,
      // bottom2,
      // top2,
    }));
  }

  zoomOut() {
    const { data } = this.state;
    this.setState(() => ({
      data: data.slice(),
      refAreaLeft: '',
      refAreaRight: '',
      left: 'dataMin',
      right: 'dataMax',
      top : dataMax => (Math.floor(dataMax)+1),
      bottom : dataMin => (Math.floor(dataMin)-1),
      top2 : dataMax => (Math.floor(dataMax)+20),
      bottom2 : dataMin => (Math.floor(dataMin)-20)
    }));
  }

  render() {
    const {
      data, barIndex, left, right, refAreaLeft, refAreaRight, top, bottom, top2, bottom2,
    } = this.state;

    const legendStyle = {
      color: '#FFFFFF'
    }
    //recharts-default-legend

    return (
      <div className="highlight-bar-charts" style={{ userSelect: 'none' }}>
        <button
          // href="javascript: void(0);"
          className="btn update"
          onClick={this.zoomOut.bind(this)}
        >
          Zoom Out

        </button>

        <LineChart
                width={900}
                height={400}
                data={this.state.data}
                onMouseDown = { (e) => e && this.setState({refAreaLeft:e.activeLabel})}
                onMouseMove = { (e) => e && this.state.refAreaLeft && this.setState({refAreaRight:e.activeLabel}) }
                onMouseUp = { this.zoom.bind( this ) }
              >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis 
                  allowDataOverflow={true}
                  dataKey="date_number"
                  tickFormatter={(tick) => convertToRealTime(tick, true)}
                  domain={[this.state.left, this.state.right]}
                  type="number"
                  tick={{fontSize: '1rem', fill: '#FFFFFF'}}
                  tickCount="7"
                  
                />
                <YAxis 
                  allowDataOverflow={true}
                  domain={[this.state.bottom, this.state.top]}
                  type="number"
                  yAxisId="1"
                  tick={{fontSize: '1rem', fill: '#FFFFFF'}}
                  padding={{bottom: 8}}
                 />
                <Tooltip labelFormatter={(label) => convertToRealTime(label, true)}/>
                <Legend
                  content ={(props)=> {
                    const { payload } = props;
                    return (
                      <Ul>
                        {
                          payload.map((entry, index) => (
                            <div style={{display: 'flex', flexDirection:'row', marginTop: '1rem'}}>
                              <svg className="recharts-surface" width="20" height="20" style={{marginRight: '0.5rem', marginTop:'0.2rem'}} viewBox="0 0 32 32" version="1.1">
                                <path fill={entry.color} className="recharts-symbols" transform="translate(16, 16)" d="M5.856406460551019,3.381197846482995L5.856406460551019,15.094010767585033L-5.856406460551019,15.094010767585033L-5.856406460551019,3.3811978464829937L-16,-2.475208614068025L-10.143593539448982,-12.618802153517008L4.440892098500626e-16,-6.762395692965988L10.143593539448982,-12.618802153517008L16,-2.475208614068025Z"></path>
                              </svg>
                              <li type="wfe"key={`item-${index}`}>{entry.value}</li>
                            </div>
                          ))
                        }
                      </Ul>
                    );
                  }} 
                  iconSize={20} 
                  iconType='wye' 
                  wrapperStyle={legendStyle}
                />
                <Line yAxisId="1" type='natural' dataKey='open_price' name="Open Price" stroke='#8804d8' animationDuration={300} dot={false}/>
                <Line yAxisId="1" type='natural' dataKey='close_price' name="Close Price" stroke='#8084d8' animationDuration={300} dot={false}/>   
                <Line yAxisId="1" type='natural' dataKey='low_price' name="Low Price" stroke='#f45b5b' animationDuration={300} dot={false}/>   
                <Line yAxisId="1" type='natural' dataKey='high_price' name="High Price" stroke='#82ca9d' animationDuration={300} dot={false}/>     
                {
                    (this.state.refAreaLeft && this.state.refAreaRight) ? (
                  <ReferenceArea yAxisId="1" x1={this.state.refAreaLeft} x2={this.state.refAreaRight}  strokeOpacity={0.3} /> ) : null

                }
              </LineChart>
      </div>
    );
  }
}
