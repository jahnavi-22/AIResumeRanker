package com.resumeranker.backend.util;

import java.io.IOException;
import java.io.InputStream;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.DefaultRedirectStrategy;
import org.apache.hc.core5.http.ClassicHttpResponse;

public class FileDownloaderUtil {
    public static InputStream downloadFile(String urlString) throws IOException {
        if (urlString.contains("drive.google.com") && urlString.contains("/file/d/")) {
            String fileId = urlString.split("/file/d/")[1].split("/")[0];
            urlString = "https://drive.google.com/uc?export=download&id=" + fileId;
        }

        try (CloseableHttpClient client = HttpClients.custom()
                .setRedirectStrategy(new DefaultRedirectStrategy())
                .build()) {

            HttpGet request = new HttpGet(urlString);
            try (ClassicHttpResponse response = client.executeOpen(null, request, null)) {
                int status = response.getCode();
                if (status >= 200 && status < 300) {
                    byte[] fileBytes = response.getEntity().getContent().readAllBytes();
                    return new java.io.ByteArrayInputStream(fileBytes);
                } else {
                    throw new IOException("Failed to download file: " + status);
                }
            }
        }
    }
}
