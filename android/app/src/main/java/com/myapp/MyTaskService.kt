package com.curomates.androiduat;

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class MyTaskService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {
        return intent.extras?.let {
            HeadlessJsTaskConfig(
                "SomeTaskName",
                Arguments.fromBundle(it),
                5000, // timeout for the task
                false // optional: defines whether or not the task is allowed in foreground.
                // Default is false
            )
        }
    }
}
