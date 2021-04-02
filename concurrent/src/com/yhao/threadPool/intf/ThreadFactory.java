package com.yhao.threadPool.intf;

@FunctionalInterface
public interface ThreadFactory {
    Thread createThread(Runnable runnable);
}
