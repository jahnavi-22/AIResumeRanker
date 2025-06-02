package com.resumeranker.backend.util;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public class FileParserUtil {

    private static final Tika tika = new Tika();

    public static String extractText(MultipartFile file) throws TikaException, IOException {
        return tika.parseToString(file.getInputStream());
    }

    public static String extractText(InputStream stream) throws IOException, TikaException {
        return tika.parseToString(stream);
    }
}

//Apache Tika to convert PDFs, DOCX, etc., into plain text.
//extractText accepts a MultipartFile and returns its text content.