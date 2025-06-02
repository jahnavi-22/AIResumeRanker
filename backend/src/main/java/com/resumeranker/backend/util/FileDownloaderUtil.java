package com.resumeranker.backend.util;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public class FileDownloaderUtil {
    public static InputStream downloadFile(String urlString) throws IOException {
        URL url = new URL(urlString);
        return url.openStream();
    }
}
