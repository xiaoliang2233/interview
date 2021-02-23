const data = [
  {
    title: '编译',
    jobs: [
      {
        name: '编译',
        status: 'success',
        time: 123020
      }
    ]
  },
  {
    title: '部署',
    jobs: [
      {
        name: '部署',
        status: 'success',
        time: 313020
      },
      {
        name: '部署',
        status: 'success',
        time: 633020
      },
    ]
  },
  {
    title: '代码扫描和检查',
    jobs: [
      {
        name: 'STC',
        status: 'success',
        time: 133020
      },
      {
        name: 'PMD',
        status: 'success',
        time: 453020
      },
      {
        name: 'EDC',
        status: 'fail',
        time: 253020
      }
    ]
  },
  {
    title: '集成测试',
    jobs: [
      {
        name: '集成测试',
        status: 'fail',
        time: 783020
      },
      {
        name: '单元测试',
        status: 'fail',
        time: 233020
      },
      {
        name: '集成测试',
        status: 'fail',
        time: 783020
      },
      {
        name: '单元测试',
        status: 'fail',
        time: 233020
      }
    ]
  }
]
class Pipeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stages: props.data
    };
  }

  render() {
    const stages = this.state.stages;
    return (
      <div className={'pipeline'} >
        {
          stages.map((stage, index) => {
            let position = 'middle';
            if(index === 0) position = 'start';
            if(index === stages.length - 1) position = 'end';
            return <PipelineItem key={index} data={stage} position={position} />
          })
        }
      </div>
    );
  }
}
class PipelineItem extends React.Component {
  constructor(props) {
    super();
    this.state = {
      stage: props.data,
      position: props.position
    };
  }
  render() {
    const { stage, position } = this.state;
    return (
      <div className='pipelineItem'>
        <h5 className='title'>{stage.title}</h5>
        <div className='jobs'>
          {
            stage.jobs.map((job, index) => {
              return <Job key={index} data={job} position={position} index={index} />
            })
          }
        </div>
      </div>
    )
  }
}
class Job extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      job: props.data,
      position: props.position,
      index: props.index
    }
  }

  addPrefixZero(time) {
    return `${time < 10 ? `0${time}` : time}`
  }

  formatTime(timestamp) {
    const hour = Math.floor((timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minute = Math.floor((timestamp % (1000 * 60 * 60))/ (1000 * 60));
    const second = Math.floor((timestamp % (1000 * 60)) / 1000);
    return `${this.addPrefixZero(hour)}:${this.addPrefixZero(minute)}:${this.addPrefixZero(second)}`
  }

  /** first job */
  horizontalLine(position) {
    return <span className={`horizontal-line horizontal-line-${position}`} />
  }

  /** second job */
  doubleCurve(position) {
    return (
      <div className={`arc-box arc-box-double-curve arc-box-${position}`}>
        <div className={'double-curve'}>
          <div className={`curve double-curve-top`} />
          <div className={`double-curve-middle`} />
          <div className={`curve curve-bottom`} />
        </div>
      </div>
    );
  }

  /** other jobs */
  singleCurve(position) {
    return (
      <div className={`arc-box arc-box-single-curve arc-box-${position}`}>
        <div className={'single-curve'}>
          <div className={`single-curve-middle`} />
          <div className={`curve curve-bottom`} />
        </div>
      </div>
    );
  }

  renderLeftLine() {
    const {position, index} = this.state;
    /** 第一个元素的左侧无线 */
    if(position === 'start') {
      return null;
    }
    switch (index) {
      case 0: {
        /** 第一个任务水平线 */
        return this.horizontalLine('left')
      }
      case 1: {
        /** 第二个任务两条取线 */
        return this.doubleCurve('left')
      }
      default: {
        /** 第三个任务一条取线 */
        return this.singleCurve('left')
      }
    }
  }

  renderRightLine() {
    const {position, index} = this.state;
    /** 最后一个元素的右侧无线 */
    if(position === 'end') {
      return null;
    }
    switch (index) {
      case 0: {
        /** 第一个任务水平线 */
        return this.horizontalLine('right')
      }
      case 1: {
        /** 第二个任务两条取线 */
        return this.doubleCurve('right')
      }
      default: {
        /** 第三个任务一条取线 */
        return this.singleCurve('right')
      }
    }
  }

  render() {
    const {name, status, time} = this.state.job
    return (
      <div className={'job-box'}>
        {this.renderLeftLine()}
        <div className={'job'}>
          <Icon data={status} />
          <span className={'name'}>{name}</span>
          <span>{this.formatTime(time)}</span>
        </div>
        {this.renderRightLine()}
      </div>
    )
  }
}
class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: props.data
    }
  }
  iconSuccess() {
    return '✅'
  }
  iconError() {
    return '❎'
  }
  render() {
    return (
      <span className={'icon'}>
        {this.state.status === 'success' ? this.iconSuccess() : this.iconError()}
      </span>
    )
  }
}

ReactDOM.render(
  <Pipeline data={data} />,
  document.getElementById('root')
);
