package com.yhao.threadPool.intf;

public interface RunnableQueue {
    void offer(Runnable runnable);

    Runnable take() throws InterruptedException;

    // 获取队列中任务的数量
    int size();
}
