package com.yhao.threadPool.impl;

import com.yhao.threadPool.intf.RunnableQueue;

// 是Runnable的一个实现，主要用于线程池内部，
// 该类会使用到RunnableQueue，然后不断从queue中取出某个runnable，并运行
public class InternalTask implements Runnable {
    private final RunnableQueue runnableQueue;

    // volatile 保证可见性
    private volatile boolean running = true;

    public InternalTask(RunnableQueue runnableQueue) {
        this.runnableQueue = runnableQueue;
    }

    @Override
    public void run() {
        while (running && !Thread.currentThread().isInterrupted()) {
            try {
                Runnable task = runnableQueue.take();
                task.run();
            } catch (InterruptedException e) {
                running = false;
                break;
            }
        }
    }

    public void stop() {
        this.running = false;
    }
}
