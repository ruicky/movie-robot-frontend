import React from 'react';
import ListView from './components/ListView';
import PageTitle from '@/components/PageTitle';
import SubHeader from './components/SubHeader';
import {Helmet} from "react-helmet-async";


const Subscribe = ()=>{
  let titles = [];
  [...Array(13)].map(x => {
    titles.push({
      id: 1,
      title: '尼罗河上的惨案',
      year: 2022,
      mediaType: 'movie',
      image: 'https://image.tmdb.org/t/p/w300_and_h450_face/82chIkE3LRlE9WUAVo0R4lSeM4Z.jpg',
      summary: '比利时大侦探赫尔克里·波洛打算乘船前往埃及度假，但一对情侣在蜜月中遭遇惨案，因此他开始了寻凶之旅。本片改编自阿加莎·克里斯蒂的小说，讲述了一个充满激情、嫉妒和邪恶的故事，其结局出人意料。',
      status: '订阅中'
    })
    titles.push({
      "id": 52814,
      "mediaType": "tv",
      "title": "光环",
      year: 2022,
      "summary": "一场史诗般的26世纪人类与被称为‘星盟’的外来威胁间的冲突。改编自同名游戏。《光环》系列讲述了26世纪时，人类与外星种族之间的史诗级宇宙战争。核心人物士官长Master Chief，他是人类阻止外星大军「星盟」毁灭文化的唯一希望。16岁的Quan Ah，精明﹑胆大的她在殖民星的关键时刻遇上士官长。Catherine Halsey博士创造了超级士兵 - 斯巴达战士，人造智能Cortana可能是人类能否生存下去的关键，Soren-066是个道德观复杂的私掠船船长，即将与在军中时的军士长兼前好友士官长有所冲突。Margaret Parangosky上将是美国海军情报局的领导。斯巴达战士Vannak-134，有强化神经机器的他是个童年时期就被征召的超级士兵，士官长的副手斯巴达战士Riz-028，她是个专注﹑专业的士兵，犹如杀戮机器一般，还有有胆识﹑好奇心重的斯巴达战士新人Kai-125。",
      "image": "https://image.tmdb.org/t/p/w300_and_h450_face/nJUHX3XL1jMkk8honUZnUmudFb9.jpg",
      status: '待审批'
    })
    titles.push({
      "id": 453395,
      "mediaType": "movie",
      "title": "奇异博士2：疯狂多元宇宙",
      year: 2022,
      "summary": '《奇异博士2》是漫威电影工作室出品的超级英雄电影，本名史蒂芬·斯特兰奇（Stephen "Steve" Vincent Strange），原本是一名优秀的神经外科医学博士，因一次车祸导致其双手再也无法使用手术刀正常工作，为了治好自己的双手史蒂芬寻遍东西方，世界各地名医都徒劳无果，绝望的他只能来到喜马拉雅山上拜访传说中的魔法师古一（Ancient One），却被古一看中并传授其使用魔法的能力，出师后的史蒂芬化身奇异博士守卫世界，后在师父古一阵亡后接替其位置，成为至尊魔法师，奇异博士拥有强大的魔法能力，是漫威世界中领头级的一线超级英雄之一。',
      "image": "https://image.tmdb.org/t/p/w300_and_h450_face/xSNSQSuzEsVIVMDlcsfK9gw7GQC.jpg",
      status: '已完成'
    })
  })
  return(
    <>
      <Helmet title="订阅"/>
      <PageTitle text="订阅"/>
      <SubHeader text='最近添加' />
      <ListView
        items={titles}
      />
    </>
  )
}

export default Subscribe