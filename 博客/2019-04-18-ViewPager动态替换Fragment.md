---
layout:     post  
title:      ViewPager动态替换Fragment
subtitle:   ViewPager动态替换Fragment 
date:       2019-4-18
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---

## ViewPager动态替换Fragment

最近遇到一个需求，主页采用ViewPager+Fragment的主页。用户在设置中可以动态修改ViewPager的Fragment。原本以为只是动态修改数据源，然后调用notifyDataSetChanged()就可以了。然鹅并不是这样。

简单记录一下最后的解决方案：

初始化数据的时候，创建所有可能会出现的Fragment

~~~java
        walletFragment = new WalletFragment();
        washFragment = new WashFragment();
        userFragment = new UserFragment();
        partnerFragment = new PartnerFragment();

        fragments.add(walletFragment);
        fragments.add(washFragment);
        if (currentUser == AppConstant.user) {
            fragments.add(userFragment);
        } else {
            fragments.add(partnerFragment);
        }

        vpMain.setOffscreenPageLimit(3);
        mainPagerAdapter = new MainPagerAdapter(getSupportFragmentManager(), fragments);
        vpMain.setAdapter(mainPagerAdapter);
        tabMain.setCurrentTab(1);
        vpMain.setCurrentItem(1, false);
~~~



主要在Adapter中处理

~~~java
public class MainPagerAdapter extends FragmentPagerAdapter {

    private ArrayList<Fragment> fragments;

    public MainPagerAdapter(FragmentManager fm, ArrayList<Fragment> fragments) {
        super(fm);
        this.fragments = fragments;
    }

    @Override
    public int getCount() {
        return fragments.size();
    }

    @Override
    public Fragment getItem(int position) {
        return fragments.get(position);
    }


    @Override
    public long getItemId(int position) {
        return fragments.get(position).hashCode();

    }

    @Override
    public int getItemPosition(Object object) {
        return POSITION_NONE;
    }
}

~~~

重点是这两个方法 `getItemId()`和`getItemPosition()`  通过这两个方法来解决adapger的缓存问题。



最后在切换的时候调用

~~~java
    private void switchUser(int eventIntData) {
        
        if (eventIntData == AppConstant.user) {
            //删除商户 添加用户
            if (fragments.contains(partnerFragment)) {
                fragments.remove(partnerFragment);
                fragments.add(2, userFragment);
            }


        } else if (eventIntData == AppConstant.partner) {
            //删除用户 添加商户
            if (fragments.contains(userFragment)) {
                fragments.remove(userFragment);
                fragments.add(2, partnerFragment);
            }
        }

        mainPagerAdapter.notifyDataSetChanged();
    }

~~~

