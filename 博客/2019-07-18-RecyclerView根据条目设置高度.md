---
layout:     post  
title:      RecyclerView根据条目设置高度 
subtitle:   RecyclerView根据条目设置高度 
date:       2019-07-18
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---

## 前言

实在不知道这玩意应该怎么叫。



之前做底部列表弹窗的时候被UI要求过根据数据量调整列表的高度。

举例：列表里如果有超过5条数据，那列表的高度就是5个item的高度。

当时列表是用ListView做的,贴出当时做的代码

~~~java
 /**
     * 根据最多显示item设置list的高度
     *
     * @param listMaxHeightWhitItem
     */
    private void setListViewHeight(int listMaxHeightWhitItem) {
       ListAdapter listAdapter = lvList.getAdapter();
        if (listAdapter == null) {
            return;
        }
        //获取其中的一个
        View itemView = listAdapter.getView(0, null, lvList);
        itemView.measure(0, 0);
        int itemHeight = itemView.getMeasuredHeight();
        int itemCount = listAdapter.getCount();
        LinearLayout.LayoutParams layoutParams = null;
        if (itemCount <= listMaxHeightWhitItem) {
            layoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    itemHeight * itemCount);
        } else if (itemCount > listMaxHeightWhitItem) {
            layoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    itemHeight * listMaxHeightWhitItem);
        }
        lvList.setLayoutParams(layoutParams);

    }
~~~



最近新做的项目都已经用RecyclerView代替了ListView，想着也做下这个功能。但是RecyclerView并没有getView()这样的方法。本来觉得也挺简单的，在网上找找RecyclerView获取itemView的方法就搞定了。没想到连着看了几篇文章没一个靠谱。这里记录我最后的做法

~~~java
 RecyclerView.Adapter adapter = rvScreenshot.getAdapter();
        int itemCount = adapter.getItemCount();
        if (itemCount >0){
            RecyclerView.ViewHolder holder = adapter.createViewHolder(rvScreenshot, adapter
                    .getItemViewType(0));
            adapter.onBindViewHolder(holder, 0);
            holder.itemView.measure(
                    View.MeasureSpec.makeMeasureSpec(rvScreenshot.getWidth(), View.MeasureSpec.EXACTLY),
                    View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
            holder.itemView.layout(0, 0, holder.itemView.getMeasuredWidth(),
                    holder.itemView.getMeasuredHeight());
            holder.itemView.setDrawingCacheEnabled(true);
            holder.itemView.buildDrawingCache();

            int measuredHeight = holder.itemView.getMeasuredHeight();
            
            LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                    measuredHeight * 5);
            rvScreenshot.setLayoutParams(layoutParams);
        }

~~~





[代码传送门](https://github.com/yeqiu/HailHydra/blob/master/hydra/src/main/java/com/yeqiu/hydra/utils/ViewUtils.java)